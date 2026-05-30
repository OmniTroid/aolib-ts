/**
 * Codegen: reads aolib-meta/ and emits generated/packets.ts + generated/enums.ts.
 *
 * Inputs:
 *   - aolib-meta/schemas/packets/<Name>.schema.json — one per packet
 *   - aolib-meta/schemas/enums/<Name>.enum.json     — one per named enum,
 *     referenced from packet schemas via `{ "$ref": "<Name>.enum.json" }`.
 *     Each carries an
 *     `x-enum-names` array parallel to the `enum` values so codegen
 *     can produce a TS `enum`.
 *   - scripts/registry.json — direction routing per header
 *
 * Outputs:
 *   - generated/enums.ts — one `export enum` per .enum.json file
 *   - generated/packets.ts — one class per packet, plus direction maps
 *
 * For each .schema.json this produces a TypeScript class:
 *   - declared properties (`!: T`) carry the *decoded* shape — every
 *     visible field present
 *   - the constructor's parameter type carries the *input* shape —
 *     default-bearing fields optional, const-only slots omitted
 *   - the constructor body assigns visible fields with `??` defaults
 *
 * Properties whose schema is a `$ref` to an enum file render as the
 * named TS enum type, imported from `./enums`. Ajv resolves the same
 * `$ref` at validate-time via schemas added through `validate.ts`.
 *
 * Run via `bun run codegen`. Output is committed.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPTS_DIR, "..");
const SCHEMAS_ROOT = join(ROOT, "aolib-meta/schemas");
const PACKETS_DIR = join(SCHEMAS_ROOT, "packets");
const ENUMS_DIR = join(SCHEMAS_ROOT, "enums");
const TYPES_DIR = join(SCHEMAS_ROOT, "types");
const REGISTRY_FILE = join(SCRIPTS_DIR, "registry.json");
const OUT_PACKETS = join(ROOT, "generated/packets.ts");
const OUT_ENUMS = join(ROOT, "generated/enums.ts");
const OUT_TYPES = join(ROOT, "generated/types.ts");

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
  $ref?: string;
  "x-fanta-escape"?: boolean;
  "x-fanta-codec"?: string;
  "x-enum-names"?: string[];
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

interface EnumDef {
  name: string;            // TS enum name, also file basename
  filename: string;        // e.g. "Side.enum.json"
  values: unknown[];       // schema enum values
  names: string[];         // parallel x-enum-names
  isString: boolean;       // string vs integer underlying type
  description?: string;
}

interface TypeDef {
  name: string;            // TS interface name, also file basename
  filename: string;        // e.g. "Offset.type.json"
  schema: JsonSchema;      // the raw schema, used to render the body
  description?: string;
}

function loadJson(path: string): JsonSchema {
  return JSON.parse(readFileSync(path, "utf8")) as JsonSchema;
}

function loadRegistry(): Registry {
  return JSON.parse(readFileSync(REGISTRY_FILE, "utf8")) as Registry;
}

function listPacketNames(): string[] {
  return readdirSync(PACKETS_DIR)
    .filter((f) => f.endsWith(".schema.json"))
    .map((f) => f.replace(/\.schema\.json$/, ""));
}

function listEnumFiles(): string[] {
  return readdirSync(ENUMS_DIR).filter((f) => f.endsWith(".enum.json"));
}

function listTypeFiles(): string[] {
  try {
    return readdirSync(TYPES_DIR).filter((f) => f.endsWith(".type.json"));
  } catch {
    return [];
  }
}

function loadTypes(): Map<string, TypeDef> {
  const out = new Map<string, TypeDef>();
  for (const filename of listTypeFiles()) {
    const schema = loadJson(join(TYPES_DIR, filename));
    const name = filename.replace(/\.type\.json$/, "");
    out.set(filename, {
      name,
      filename,
      schema,
      description: typeof schema.description === "string" ? schema.description : undefined,
    });
  }
  return out;
}

function loadEnums(): Map<string, EnumDef> {
  const out = new Map<string, EnumDef>();
  for (const filename of listEnumFiles()) {
    const schema = loadJson(join(ENUMS_DIR, filename));
    const name = filename.replace(/\.enum\.json$/, "");
    if (!schema.enum || !schema["x-enum-names"]) {
      throw new Error(`Enum schema ${filename} missing 'enum' or 'x-enum-names'`);
    }
    if (schema.enum.length !== schema["x-enum-names"].length) {
      throw new Error(`Enum schema ${filename}: 'enum' and 'x-enum-names' lengths differ`);
    }
    out.set(filename, {
      name,
      filename,
      values: schema.enum,
      names: schema["x-enum-names"],
      isString: schema.type === "string",
      description: typeof schema.description === "string" ? schema.description : undefined,
    });
  }
  return out;
}

function normalizeRegistry(entries: (string | RegistryEntry)[]): RegistryEntry[] {
  return entries.map((e) =>
    typeof e === "string" ? { header: e, schema: e } : e,
  );
}

// ---------------------------------------------------------------------
// JSON Schema → TS type rendering
// ---------------------------------------------------------------------

interface RenderCtx {
  enums: Map<string, EnumDef>;
  types: Map<string, TypeDef>;
  enumImports: Set<string>; // populated with enum names referenced
  typeImports: Set<string>; // populated with type names referenced
}

function renderType(s: JsonSchema, indent: number, ctx: RenderCtx): string {
  if (s.$ref) {
    const enumDef = ctx.enums.get(s.$ref);
    if (enumDef) {
      ctx.enumImports.add(enumDef.name);
      return enumDef.name;
    }
    const typeDef = ctx.types.get(s.$ref);
    if (typeDef) {
      ctx.typeImports.add(typeDef.name);
      return typeDef.name;
    }
    return "unknown";
  }
  if (s.const !== undefined) return JSON.stringify(s.const);
  if (s.enum) return s.enum.map((v) => JSON.stringify(v)).join(" | ");

  const t = s.type;
  if (Array.isArray(t)) return t.map((tt) => primitive(tt)).join(" | ");
  if (t === "object") return renderObjectType(s, indent, ctx);
  if (t === "array") {
    const inner = s.items ? renderType(s.items, indent, ctx) : "unknown";
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

function renderObjectType(s: JsonSchema, indent: number, ctx: RenderCtx): string {
  if (!s.properties) return "Record<string, unknown>";
  const required = new Set(s.required ?? []);
  const pad = "  ".repeat(indent + 1);
  const closing = "  ".repeat(indent);
  const lines: string[] = [];
  for (const [key, sub] of Object.entries(s.properties)) {
    const optional = !required.has(key);
    lines.push(`${pad}${quoteKey(key)}${optional ? "?" : ""}: ${renderType(sub, indent + 1, ctx)};`);
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
  type: string;
  hasDefault: boolean;
  defaultLiteral?: string;
  hasConst: boolean;
  constLiteral?: string;
  required: boolean;
}

function classifyProperties(schema: JsonSchema, ctx: RenderCtx): PropInfo[] {
  const props = schema.properties ?? {};
  const required = new Set(schema.required ?? []);
  return Object.entries(props).map(([key, sub]) => ({
    key,
    type: renderType(sub, 1, ctx),
    hasDefault: sub.default !== undefined,
    defaultLiteral: sub.default !== undefined ? JSON.stringify(sub.default) : undefined,
    hasConst: sub.const !== undefined,
    constLiteral: sub.const !== undefined ? JSON.stringify(sub.const) : undefined,
    required: required.has(key),
  }));
}

function emitClass(name: string, schema: JsonSchema, ctx: RenderCtx): string {
  const props = classifyProperties(schema, ctx);
  // Const-typed properties (`$header`, PV's `_cid`) are protocol
  // metadata. They're real schema fields the wire carries, but they
  // never appear on the user-facing instance type or in the
  // constructor input.
  const visible = props.filter((p) => !p.hasConst);

  const declarations = visible
    .map((p) => `  ${quoteKey(p.key)}!: ${p.type};`)
    .join("\n");

  const ctorParamLines = visible.map((p) => {
    const optional = !p.required || p.hasDefault;
    return `    ${quoteKey(p.key)}${optional ? "?" : ""}: ${p.type};`;
  });
  const ctorParam = ctorParamLines.length === 0
    ? "_input: Record<string, never> = {}"
    : `input: {\n${ctorParamLines.join("\n")}\n  }`;

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
// Enum file emission
// ---------------------------------------------------------------------

function emitTypesFile(types: Map<string, TypeDef>): string {
  const parts: string[] = [
    "// AUTO-GENERATED from aolib-meta/schemas/types/*. Do not edit; run `bun run codegen`.\n",
  ];
  const sorted = [...types.values()].sort((a, b) => a.name.localeCompare(b.name));
  for (const t of sorted) {
    if (t.description) parts.push(`/** ${t.description} */`);
    // Render as `interface Name { ... }`. Use a minimal ctx; nested
    // refs to other types/enums round-trip through the same lookup.
    const body = renderObjectType(t.schema, 0, {
      enums: new Map(),
      types,
      enumImports: new Set(),
      typeImports: new Set(),
    });
    parts.push(`export interface ${t.name} ${body}\n`);
  }
  return parts.join("\n");
}

function emitEnumsFile(enums: Map<string, EnumDef>): string {
  const parts: string[] = [
    "// AUTO-GENERATED from aolib-meta/schemas/enums/*. Do not edit; run `bun run codegen`.\n",
  ];
  // Sort by name for deterministic output.
  const sorted = [...enums.values()].sort((a, b) => a.name.localeCompare(b.name));
  for (const e of sorted) {
    if (e.description) parts.push(`/** ${e.description} */`);
    parts.push(`export enum ${e.name} {`);
    for (let i = 0; i < e.names.length; i++) {
      const lit = e.isString ? JSON.stringify(e.values[i]) : String(e.values[i]);
      parts.push(`  ${e.names[i]} = ${lit},`);
    }
    parts.push("}\n");
  }
  return parts.join("\n");
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
  const enums = loadEnums();
  const types = loadTypes();
  const packets = [...listPacketNames()].sort();
  const reg = loadRegistry();

  // Enums + types files are straightforward — no per-packet context.
  writeFileSync(OUT_ENUMS, emitEnumsFile(enums));
  writeFileSync(OUT_TYPES, emitTypesFile(types));

  // Packets file — render with a shared context so enum + type
  // imports accumulate as we walk each packet.
  const ctx: RenderCtx = {
    enums,
    types,
    enumImports: new Set(),
    typeImports: new Set(),
  };
  const classBlocks: string[] = [];
  for (const name of packets) {
    const schema = loadJson(join(PACKETS_DIR, `${name}.schema.json`));
    classBlocks.push(emitClass(name, schema, ctx));
  }

  const enumImports = ctx.enumImports.size === 0
    ? ""
    : `import { ${[...ctx.enumImports].sort().join(", ")} } from "./enums";\n`;
  const typeImports = ctx.typeImports.size === 0
    ? ""
    : `import { ${[...ctx.typeImports].sort().join(", ")} } from "./types";\n`;

  const parts: string[] = [
    "// AUTO-GENERATED from aolib-meta/schemas/. Do not edit; run `bun run codegen`.\n",
    "/* eslint-disable */\n",
    enumImports + typeImports,
  ];

  // Enum + type schemas — imported as runtime values so validate.ts
  // can register them with Ajv for $ref resolution.
  const enumNames = [...enums.values()].map((e) => e.name).sort();
  const typeNames = [...types.values()].map((t) => t.name).sort();
  for (const name of enumNames) {
    parts.push(`import ${name}EnumSchema from "../aolib-meta/schemas/enums/${name}.enum.json";\n`);
  }
  for (const name of typeNames) {
    parts.push(`import ${name}TypeSchema from "../aolib-meta/schemas/types/${name}.type.json";\n`);
  }
  parts.push("");

  for (const name of packets) {
    parts.push(`import ${name}Schema from "../aolib-meta/schemas/packets/${name}.schema.json";\n`);
  }
  parts.push("");

  for (const name of packets) {
    parts.push(`export { default as ${name}Schema } from "../aolib-meta/schemas/packets/${name}.schema.json";\n`);
  }
  parts.push("");

  parts.push(
    `export const enumSchemas = [${enumNames.map((n) => `${n}EnumSchema`).join(", ")}];\n`,
  );
  parts.push(
    `export const typeSchemas = [${typeNames.map((n) => `${n}TypeSchema`).join(", ")}];\n`,
  );
  parts.push("");

  for (const block of classBlocks) {
    parts.push(block);
    parts.push("");
  }

  parts.push(emitDirectionMaps(reg));

  writeFileSync(OUT_PACKETS, parts.join("\n"));
  console.log(
    `Wrote ${OUT_ENUMS} (${enums.size} enums), ` +
      `${OUT_PACKETS} (${packets.length} packets)`,
  );
}

main();
