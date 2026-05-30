/**
 * Codegen: reads schemas/ and emits generated/packets.ts.
 *
 * For each schemas/<Name>.schema.json this produces a TypeScript
 * class:
 *
 *   - declared properties (`!: T`) carry the *decoded* shape — every
 *     visible field present, $header included as a `const`-typed slot
 *   - the constructor's parameter type carries the *input* shape —
 *     default-bearing fields optional, const-only slots omitted
 *   - the constructor body assigns `$header`, copies provided fields,
 *     and fills defaults with `??`
 *
 * The class is the single source of typing for both encode (caller
 * passes input shape) and decode (handler receives instance). The
 * library prototype-rehydrates parsed wire data into instances so
 * `instanceof` works.
 *
 * Each class is paired with its JSON Schema (imported from
 * `../schemas/<Name>.schema.json`) for runtime validation by Ajv.
 *
 * scripts/registry.json maps headers to schemas per direction. From it
 * we build:
 *   - c2sSchemas / s2cSchemas — header → JSON Schema (Ajv input)
 *   - c2sClasses / s2cClasses — header → class constructor (for rehydration)
 *   - C2SInputs / S2CInputs   — header → ConstructorParameters[0] (typing)
 *   - C2SOutputs / S2COutputs — header → instance type (typing)
 *
 * Run via `bun run codegen`. Output is committed.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPTS_DIR, "..");
const SCHEMAS_DIR = join(ROOT, "schemas");
const REGISTRY_FILE = join(SCRIPTS_DIR, "registry.json");
const OUT = join(ROOT, "generated/packets.ts");

// ---------------------------------------------------------------------
// Read input
// ---------------------------------------------------------------------

interface JsonSchema {
  type?: string | string[];
  const?: unknown;
  enum?: unknown[];
  default?: unknown;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  title?: string;
  additionalProperties?: boolean;
  $schema?: string;
  "x-fanta-escape"?: boolean;
  "x-fanta-codec"?: string;
  [k: string]: unknown;
}

interface RegistryEntry {
  header: string;
  schema: string;
}

interface Registry {
  c2s: (string | RegistryEntry)[];
  s2c: (string | RegistryEntry)[];
  both: string[];
}

function loadSchema(name: string): JsonSchema {
  const text = readFileSync(join(SCHEMAS_DIR, `${name}.schema.json`), "utf8");
  return JSON.parse(text) as JsonSchema;
}

function loadRegistry(): Registry {
  const text = readFileSync(REGISTRY_FILE, "utf8");
  return JSON.parse(text) as Registry;
}

function listSchemaNames(): string[] {
  return readdirSync(SCHEMAS_DIR)
    .filter((f) => f.endsWith(".schema.json"))
    .map((f) => f.replace(/\.schema\.json$/, ""));
}

function normalizeRegistry(entries: (string | RegistryEntry)[]): RegistryEntry[] {
  return entries.map((e) =>
    typeof e === "string" ? { header: e, schema: e } : e,
  );
}

// ---------------------------------------------------------------------
// JSON Schema → TS type rendering
// ---------------------------------------------------------------------

function renderType(s: JsonSchema, indent: number): string {
  if (s.const !== undefined) return JSON.stringify(s.const);
  if (s.enum) return s.enum.map((v) => JSON.stringify(v)).join(" | ");

  const t = s.type;
  if (Array.isArray(t)) {
    return t.map((tt) => primitive(tt)).join(" | ");
  }
  if (t === "object") return renderObjectType(s, indent);
  if (t === "array") {
    const inner = s.items ? renderType(s.items, indent) : "unknown";
    return inner.includes(" ") && !inner.startsWith("{")
      ? `(${inner})[]`
      : `${inner}[]`;
  }
  if (typeof t === "string") return primitive(t);
  return "unknown";
}

function primitive(t: string): string {
  switch (t) {
    case "string":  return "string";
    case "integer":
    case "number":  return "number";
    case "boolean": return "boolean";
    case "null":    return "null";
    case "object":  return "Record<string, unknown>";
    case "array":   return "unknown[]";
    default:        return "unknown";
  }
}

/** Nested object body, all properties required (decoded form). */
function renderObjectType(s: JsonSchema, indent: number): string {
  if (!s.properties) return "Record<string, unknown>";
  const required = new Set(s.required ?? []);
  const pad = "  ".repeat(indent + 1);
  const closing = "  ".repeat(indent);
  const lines: string[] = [];
  for (const [key, sub] of Object.entries(s.properties)) {
    const optional = !required.has(key);
    lines.push(`${pad}${quoteKey(key)}${optional ? "?" : ""}: ${renderType(sub, indent + 1)};`);
  }
  return `{\n${lines.join("\n")}\n${closing}}`;
}

function quoteKey(k: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
}

// ---------------------------------------------------------------------
// Class emission
// ---------------------------------------------------------------------

interface PropInfo {
  key: string;
  type: string;        // TS type as a string
  hasDefault: boolean;
  defaultLiteral?: string; // JSON.stringified default value
  hasConst: boolean;
  constLiteral?: string;   // JSON.stringified const value
  required: boolean;       // in schema's required[]
}

function classifyProperties(schema: JsonSchema): PropInfo[] {
  const props = schema.properties ?? {};
  const required = new Set(schema.required ?? []);
  return Object.entries(props).map(([key, sub]) => ({
    key,
    type: renderType(sub, 1),
    hasDefault: sub.default !== undefined,
    defaultLiteral: sub.default !== undefined ? JSON.stringify(sub.default) : undefined,
    hasConst: sub.const !== undefined,
    constLiteral: sub.const !== undefined ? JSON.stringify(sub.const) : undefined,
    required: required.has(key),
  }));
}

function emitClass(name: string, schema: JsonSchema): string {
  const props = classifyProperties(schema);
  // Const-typed properties (`$header`, PV's `_cid`) are protocol
  // metadata. They're real schema fields the wire carries, but they
  // never appear on the user-facing instance type or in the
  // constructor input — the library fills them on encode and strips
  // them on decode.
  const visible = props.filter((p) => !p.hasConst);

  const declarations = visible
    .map((p) => `  ${quoteKey(p.key)}!: ${p.type};`)
    .join("\n");

  // Constructor parameter shape: default-bearing or non-required
  // fields optional, the rest required.
  const ctorParamLines = visible.map((p) => {
    const optional = !p.required || p.hasDefault;
    return `    ${quoteKey(p.key)}${optional ? "?" : ""}: ${p.type};`;
  });
  const ctorParam = ctorParamLines.length === 0
    ? "_input: Record<string, never> = {}"
    : `input: {\n${ctorParamLines.join("\n")}\n  }`;

  // Constructor body: assign every visible field.
  const ctorBodyLines = visible.map((p) => {
    const accessor = `this.${quoteKey(p.key)}`;
    if (p.hasDefault) {
      return `    ${accessor} = input.${quoteKey(p.key)} ?? ${p.defaultLiteral};`;
    }
    return `    ${accessor} = input.${quoteKey(p.key)};`;
  });
  const ctorBody = ctorParamLines.length === 0
    ? `    void _input;`
    : ctorBodyLines.join("\n");

  return (
    `export class ${name} {\n` +
    (declarations ? `${declarations}\n\n` : "") +
    `  constructor(${ctorParam}) {\n` +
    `${ctorBody}\n` +
    `  }\n` +
    `}\n`
  );
}

// ---------------------------------------------------------------------
// Direction maps
// ---------------------------------------------------------------------

function emitDirectionMaps(reg: Registry): string {
  const c2s = normalizeRegistry(reg.c2s);
  const s2c = normalizeRegistry(reg.s2c);
  const both = reg.both;

  const schemaLine = (header: string, schemaName: string) =>
    `  ${quoteKey(header)}: ${schemaName}Schema,`;
  const classLine = (header: string, className: string) =>
    `  ${quoteKey(header)}: ${className},`;
  const inputLine = (header: string, className: string) =>
    `  ${quoteKey(header)}: ConstructorParameters<typeof ${className}>[0];`;
  const outputLine = (header: string, className: string) =>
    `  ${quoteKey(header)}: ${className};`;

  const c2sSchemas = [
    ...c2s.map((e) => schemaLine(e.header, e.schema)),
    ...both.map((h) => schemaLine(h, h)),
  ];
  const s2cSchemas = [
    ...s2c.map((e) => schemaLine(e.header, e.schema)),
    ...both.map((h) => schemaLine(h, h)),
  ];
  const c2sClasses = [
    ...c2s.map((e) => classLine(e.header, e.schema)),
    ...both.map((h) => classLine(h, h)),
  ];
  const s2cClasses = [
    ...s2c.map((e) => classLine(e.header, e.schema)),
    ...both.map((h) => classLine(h, h)),
  ];
  const c2sIn = [
    ...c2s.map((e) => inputLine(e.header, e.schema)),
    ...both.map((h) => inputLine(h, h)),
  ];
  const s2cIn = [
    ...s2c.map((e) => inputLine(e.header, e.schema)),
    ...both.map((h) => inputLine(h, h)),
  ];
  const c2sOut = [
    ...c2s.map((e) => outputLine(e.header, e.schema)),
    ...both.map((h) => outputLine(h, h)),
  ];
  const s2cOut = [
    ...s2c.map((e) => outputLine(e.header, e.schema)),
    ...both.map((h) => outputLine(h, h)),
  ];

  return `
export const c2sSchemas = {
${c2sSchemas.join("\n")}
} as const;

export const s2cSchemas = {
${s2cSchemas.join("\n")}
} as const;

export const c2sClasses = {
${c2sClasses.join("\n")}
} as const;

export const s2cClasses = {
${s2cClasses.join("\n")}
} as const;

export type C2SInputs = {
${c2sIn.join("\n")}
};

export type S2CInputs = {
${s2cIn.join("\n")}
};

export type C2SOutputs = {
${c2sOut.join("\n")}
};

export type S2COutputs = {
${s2cOut.join("\n")}
};
`;
}

// ---------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------

function main(): void {
  const names = listSchemaNames();
  const reg = loadRegistry();
  const sorted = [...names].sort();

  const parts: string[] = [
    "// AUTO-GENERATED from schemas/. Do not edit; run `bun run codegen`.\n",
    "/* eslint-disable */\n",
  ];

  // Imports of the raw JSON Schemas — sourced live from schemas/, no
  // duplication.
  for (const name of sorted) {
    parts.push(`import ${name}Schema from "../schemas/${name}.schema.json";\n`);
  }
  parts.push("");

  // Re-export schemas for callers who want them by name.
  for (const name of sorted) {
    parts.push(`export { default as ${name}Schema } from "../schemas/${name}.schema.json";\n`);
  }
  parts.push("");

  // Class declarations.
  for (const name of sorted) {
    const schema = loadSchema(name);
    parts.push(emitClass(name, schema));
    parts.push("");
  }

  parts.push(emitDirectionMaps(reg));

  writeFileSync(OUT, parts.join("\n"));
  console.log(`Wrote ${OUT} (${names.length} schemas)`);
}

main();
