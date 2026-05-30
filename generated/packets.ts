// AUTO-GENERATED from schemas/. Do not edit; run `bun run codegen`.

/* eslint-disable */

import { AreaUpdateType, DeskModifier, EmoteModifier, Flip, ShoutModifier, Side, TextColor } from "./enums";


import AreaUpdateTypeEnumSchema from "../schemas/AreaUpdateType.enum.json";

import DeskModifierEnumSchema from "../schemas/DeskModifier.enum.json";

import EmoteModifierEnumSchema from "../schemas/EmoteModifier.enum.json";

import FlipEnumSchema from "../schemas/Flip.enum.json";

import ShoutModifierEnumSchema from "../schemas/ShoutModifier.enum.json";

import SideEnumSchema from "../schemas/Side.enum.json";

import TextColorEnumSchema from "../schemas/TextColor.enum.json";


import AESchema from "../schemas/AE.schema.json";

import AMSchema from "../schemas/AM.schema.json";

import ANSchema from "../schemas/AN.schema.json";

import ARUPSchema from "../schemas/ARUP.schema.json";

import ASSSchema from "../schemas/ASS.schema.json";

import AUTHSchema from "../schemas/AUTH.schema.json";

import BBSchema from "../schemas/BB.schema.json";

import BDSchema from "../schemas/BD.schema.json";

import BNSchema from "../schemas/BN.schema.json";

import CCSchema from "../schemas/CC.schema.json";

import CHSchema from "../schemas/CH.schema.json";

import CHECKSchema from "../schemas/CHECK.schema.json";

import CISchema from "../schemas/CI.schema.json";

import CTBroadcastSchema from "../schemas/CTBroadcast.schema.json";

import CTRequestSchema from "../schemas/CTRequest.schema.json";

import CharsCheckSchema from "../schemas/CharsCheck.schema.json";

import DESchema from "../schemas/DE.schema.json";

import DONESchema from "../schemas/DONE.schema.json";

import EESchema from "../schemas/EE.schema.json";

import EISchema from "../schemas/EI.schema.json";

import EMSchema from "../schemas/EM.schema.json";

import FASchema from "../schemas/FA.schema.json";

import FLSchema from "../schemas/FL.schema.json";

import FMSchema from "../schemas/FM.schema.json";

import HISchema from "../schemas/HI.schema.json";

import HPSchema from "../schemas/HP.schema.json";

import IDClientSchema from "../schemas/IDClient.schema.json";

import IDServerSchema from "../schemas/IDServer.schema.json";

import JDSchema from "../schemas/JD.schema.json";

import KBSchema from "../schemas/KB.schema.json";

import KKSchema from "../schemas/KK.schema.json";

import LESchema from "../schemas/LE.schema.json";

import MASchema from "../schemas/MA.schema.json";

import MCBroadcastSchema from "../schemas/MCBroadcast.schema.json";

import MCRequestSchema from "../schemas/MCRequest.schema.json";

import MSBroadcastSchema from "../schemas/MSBroadcast.schema.json";

import MSRequestSchema from "../schemas/MSRequest.schema.json";

import PESchema from "../schemas/PE.schema.json";

import PNSchema from "../schemas/PN.schema.json";

import PRSchema from "../schemas/PR.schema.json";

import PUSchema from "../schemas/PU.schema.json";

import PVSchema from "../schemas/PV.schema.json";

import RCSchema from "../schemas/RC.schema.json";

import RDSchema from "../schemas/RD.schema.json";

import RMSchema from "../schemas/RM.schema.json";

import RMCSchema from "../schemas/RMC.schema.json";

import RTSchema from "../schemas/RT.schema.json";

import SCSchema from "../schemas/SC.schema.json";

import SISchema from "../schemas/SI.schema.json";

import SMSchema from "../schemas/SM.schema.json";

import SPSchema from "../schemas/SP.schema.json";

import TISchema from "../schemas/TI.schema.json";

import VS_AUDIOSchema from "../schemas/VS_AUDIO.schema.json";

import VS_CAPSSchema from "../schemas/VS_CAPS.schema.json";

import VS_FRAMESchema from "../schemas/VS_FRAME.schema.json";

import VS_JOINBroadcastSchema from "../schemas/VS_JOINBroadcast.schema.json";

import VS_JOINRequestSchema from "../schemas/VS_JOINRequest.schema.json";

import VS_LEAVEBroadcastSchema from "../schemas/VS_LEAVEBroadcast.schema.json";

import VS_LEAVERequestSchema from "../schemas/VS_LEAVERequest.schema.json";

import VS_PEERSSchema from "../schemas/VS_PEERS.schema.json";

import VS_SPEAKBroadcastSchema from "../schemas/VS_SPEAKBroadcast.schema.json";

import VS_SPEAKRequestSchema from "../schemas/VS_SPEAKRequest.schema.json";

import ZZSchema from "../schemas/ZZ.schema.json";

import askchaaSchema from "../schemas/askchaa.schema.json";

import decryptorSchema from "../schemas/decryptor.schema.json";


export { default as AESchema } from "../schemas/AE.schema.json";

export { default as AMSchema } from "../schemas/AM.schema.json";

export { default as ANSchema } from "../schemas/AN.schema.json";

export { default as ARUPSchema } from "../schemas/ARUP.schema.json";

export { default as ASSSchema } from "../schemas/ASS.schema.json";

export { default as AUTHSchema } from "../schemas/AUTH.schema.json";

export { default as BBSchema } from "../schemas/BB.schema.json";

export { default as BDSchema } from "../schemas/BD.schema.json";

export { default as BNSchema } from "../schemas/BN.schema.json";

export { default as CCSchema } from "../schemas/CC.schema.json";

export { default as CHSchema } from "../schemas/CH.schema.json";

export { default as CHECKSchema } from "../schemas/CHECK.schema.json";

export { default as CISchema } from "../schemas/CI.schema.json";

export { default as CTBroadcastSchema } from "../schemas/CTBroadcast.schema.json";

export { default as CTRequestSchema } from "../schemas/CTRequest.schema.json";

export { default as CharsCheckSchema } from "../schemas/CharsCheck.schema.json";

export { default as DESchema } from "../schemas/DE.schema.json";

export { default as DONESchema } from "../schemas/DONE.schema.json";

export { default as EESchema } from "../schemas/EE.schema.json";

export { default as EISchema } from "../schemas/EI.schema.json";

export { default as EMSchema } from "../schemas/EM.schema.json";

export { default as FASchema } from "../schemas/FA.schema.json";

export { default as FLSchema } from "../schemas/FL.schema.json";

export { default as FMSchema } from "../schemas/FM.schema.json";

export { default as HISchema } from "../schemas/HI.schema.json";

export { default as HPSchema } from "../schemas/HP.schema.json";

export { default as IDClientSchema } from "../schemas/IDClient.schema.json";

export { default as IDServerSchema } from "../schemas/IDServer.schema.json";

export { default as JDSchema } from "../schemas/JD.schema.json";

export { default as KBSchema } from "../schemas/KB.schema.json";

export { default as KKSchema } from "../schemas/KK.schema.json";

export { default as LESchema } from "../schemas/LE.schema.json";

export { default as MASchema } from "../schemas/MA.schema.json";

export { default as MCBroadcastSchema } from "../schemas/MCBroadcast.schema.json";

export { default as MCRequestSchema } from "../schemas/MCRequest.schema.json";

export { default as MSBroadcastSchema } from "../schemas/MSBroadcast.schema.json";

export { default as MSRequestSchema } from "../schemas/MSRequest.schema.json";

export { default as PESchema } from "../schemas/PE.schema.json";

export { default as PNSchema } from "../schemas/PN.schema.json";

export { default as PRSchema } from "../schemas/PR.schema.json";

export { default as PUSchema } from "../schemas/PU.schema.json";

export { default as PVSchema } from "../schemas/PV.schema.json";

export { default as RCSchema } from "../schemas/RC.schema.json";

export { default as RDSchema } from "../schemas/RD.schema.json";

export { default as RMSchema } from "../schemas/RM.schema.json";

export { default as RMCSchema } from "../schemas/RMC.schema.json";

export { default as RTSchema } from "../schemas/RT.schema.json";

export { default as SCSchema } from "../schemas/SC.schema.json";

export { default as SISchema } from "../schemas/SI.schema.json";

export { default as SMSchema } from "../schemas/SM.schema.json";

export { default as SPSchema } from "../schemas/SP.schema.json";

export { default as TISchema } from "../schemas/TI.schema.json";

export { default as VS_AUDIOSchema } from "../schemas/VS_AUDIO.schema.json";

export { default as VS_CAPSSchema } from "../schemas/VS_CAPS.schema.json";

export { default as VS_FRAMESchema } from "../schemas/VS_FRAME.schema.json";

export { default as VS_JOINBroadcastSchema } from "../schemas/VS_JOINBroadcast.schema.json";

export { default as VS_JOINRequestSchema } from "../schemas/VS_JOINRequest.schema.json";

export { default as VS_LEAVEBroadcastSchema } from "../schemas/VS_LEAVEBroadcast.schema.json";

export { default as VS_LEAVERequestSchema } from "../schemas/VS_LEAVERequest.schema.json";

export { default as VS_PEERSSchema } from "../schemas/VS_PEERS.schema.json";

export { default as VS_SPEAKBroadcastSchema } from "../schemas/VS_SPEAKBroadcast.schema.json";

export { default as VS_SPEAKRequestSchema } from "../schemas/VS_SPEAKRequest.schema.json";

export { default as ZZSchema } from "../schemas/ZZ.schema.json";

export { default as askchaaSchema } from "../schemas/askchaa.schema.json";

export { default as decryptorSchema } from "../schemas/decryptor.schema.json";


export const enumSchemas = [AreaUpdateTypeEnumSchema, DeskModifierEnumSchema, EmoteModifierEnumSchema, FlipEnumSchema, ShoutModifierEnumSchema, SideEnumSchema, TextColorEnumSchema];


export class AE {
  id!: number;

  constructor(input: {
    id: number;
  }) {
    this.id = input.id;
  }
}


export class AM {
  batch!: number;

  constructor(input: {
    batch: number;
  }) {
    this.batch = input.batch;
  }
}


export class AN {
  batch!: number;

  constructor(input: {
    batch: number;
  }) {
    this.batch = input.batch;
  }
}


export class ARUP {
  update_type!: AreaUpdateType;
  update_data!: (number | string)[];

  constructor(input: {
    update_type: AreaUpdateType;
    update_data: (number | string)[];
  }) {
    this.update_type = input.update_type;
    this.update_data = input.update_data;
  }
}


export class ASS {
  asset_url!: string;

  constructor(input: {
    asset_url: string;
  }) {
    this.asset_url = input.asset_url;
  }
}


export class AUTH {
  auth_state!: number;

  constructor(input: {
    auth_state: number;
  }) {
    this.auth_state = input.auth_state;
  }
}


export class BB {
  message!: string;

  constructor(input: {
    message: string;
  }) {
    this.message = input.message;
  }
}


export class BD {
  reason!: string;

  constructor(input: {
    reason: string;
  }) {
    this.reason = input.reason;
  }
}


export class BN {
  background!: string;
  position!: string;

  constructor(input: {
    background: string;
    position?: string;
  }) {
    this.background = input.background;
    this.position = input.position ?? "";
  }
}


export class CC {
  player_id!: number;
  char_id!: number;
  char_password!: string;

  constructor(input: {
    player_id: number;
    char_id: number;
    char_password?: string;
  }) {
    this.player_id = input.player_id;
    this.char_id = input.char_id;
    this.char_password = input.char_password ?? "";
  }
}


export class CH {
  char_id!: number;

  constructor(input: {
    char_id: number;
  }) {
    this.char_id = input.char_id;
  }
}


export class CHECK {
  constructor(_input: Record<string, never> = {}) {
    void _input;
  }
}


export class CI {
  batchIndex!: number;
  entries!: {
    index: number;
    data: string;
  }[];

  constructor(input: {
    batchIndex: number;
    entries: {
    index: number;
    data: string;
  }[];
  }) {
    this.batchIndex = input.batchIndex;
    this.entries = input.entries;
  }
}


export class CTBroadcast {
  name!: string;
  message!: string;
  is_from_server!: boolean;

  constructor(input: {
    name: string;
    message: string;
    is_from_server?: boolean;
  }) {
    this.name = input.name;
    this.message = input.message;
    this.is_from_server = input.is_from_server ?? false;
  }
}


export class CTRequest {
  name!: string;
  message!: string;

  constructor(input: {
    name: string;
    message: string;
  }) {
    this.name = input.name;
    this.message = input.message;
  }
}


export class CharsCheck {
  taken!: number[];

  constructor(input: {
    taken: number[];
  }) {
    this.taken = input.taken;
  }
}


export class DE {
  id!: number;

  constructor(input: {
    id: number;
  }) {
    this.id = input.id;
  }
}


export class DONE {
  constructor(_input: Record<string, never> = {}) {
    void _input;
  }
}


export class EE {
  id!: number;
  name!: string;
  description!: string;
  image!: string;

  constructor(input: {
    id: number;
    name: string;
    description: string;
    image: string;
  }) {
    this.id = input.id;
    this.name = input.name;
    this.description = input.description;
    this.image = input.image;
  }
}


export class EI {
  id!: number;
  details!: {
    name: string;
    description: string;
    type: string;
    image: string;
  };

  constructor(input: {
    id: number;
    details: {
    name: string;
    description: string;
    type: string;
    image: string;
  };
  }) {
    this.id = input.id;
    this.details = input.details;
  }
}


export class EM {
  batchIndex!: number;
  entries!: {
    index: number;
    name: string;
  }[];

  constructor(input: {
    batchIndex: number;
    entries: {
    index: number;
    name: string;
  }[];
  }) {
    this.batchIndex = input.batchIndex;
    this.entries = input.entries;
  }
}


export class FA {
  areas!: string[];

  constructor(input: {
    areas: string[];
  }) {
    this.areas = input.areas;
  }
}


export class FL {
  features!: string[];

  constructor(input: {
    features: string[];
  }) {
    this.features = input.features;
  }
}


export class FM {
  music_list!: {
    name: string;
  }[];

  constructor(input: {
    music_list: {
    name: string;
  }[];
  }) {
    this.music_list = input.music_list;
  }
}


export class HI {
  hdid!: string;

  constructor(input: {
    hdid: string;
  }) {
    this.hdid = input.hdid;
  }
}


export class HP {
  bar!: number;
  value!: number;

  constructor(input: {
    bar: number;
    value: number;
  }) {
    this.bar = input.bar;
    this.value = input.value;
  }
}


export class IDClient {
  software!: string;
  version!: string;

  constructor(input: {
    software: string;
    version: string;
  }) {
    this.software = input.software;
    this.version = input.version;
  }
}


export class IDServer {
  player_id!: number;
  software!: string;
  version!: string;

  constructor(input: {
    player_id: number;
    software: string;
    version: string;
  }) {
    this.player_id = input.player_id;
    this.software = input.software;
    this.version = input.version;
  }
}


export class JD {
  state!: number;

  constructor(input: {
    state: number;
  }) {
    this.state = input.state;
  }
}


export class KB {
  reason!: string;

  constructor(input: {
    reason: string;
  }) {
    this.reason = input.reason;
  }
}


export class KK {
  reason!: string;

  constructor(input: {
    reason: string;
  }) {
    this.reason = input.reason;
  }
}


export class LE {
  evidence!: {
    name: string;
    description: string;
    image: string;
  }[];

  constructor(input: {
    evidence: {
    name: string;
    description: string;
    image: string;
  }[];
  }) {
    this.evidence = input.evidence;
  }
}


export class MA {
  id!: number;
  duration!: number;
  reason!: string;

  constructor(input: {
    id: number;
    duration: number;
    reason: string;
  }) {
    this.id = input.id;
    this.duration = input.duration;
    this.reason = input.reason;
  }
}


export class MCBroadcast {
  name!: string;
  char_id!: number;
  showname!: string;
  looping!: boolean;
  channel!: number;
  effects!: number;

  constructor(input: {
    name: string;
    char_id: number;
    showname?: string;
    looping?: boolean;
    channel?: number;
    effects?: number;
  }) {
    this.name = input.name;
    this.char_id = input.char_id;
    this.showname = input.showname ?? "";
    this.looping = input.looping ?? false;
    this.channel = input.channel ?? 0;
    this.effects = input.effects ?? 0;
  }
}


export class MCRequest {
  name!: string;
  char_id!: number;
  showname!: string;
  effects!: number;

  constructor(input: {
    name: string;
    char_id: number;
    showname?: string;
    effects?: number;
  }) {
    this.name = input.name;
    this.char_id = input.char_id;
    this.showname = input.showname ?? "";
    this.effects = input.effects ?? 0;
  }
}


export class MSBroadcast {
  desk_modifier!: DeskModifier;
  preanim!: string;
  character!: string;
  emote!: string;
  message!: string;
  side!: Side;
  sfx_name!: string;
  emote_modifier!: EmoteModifier;
  char_id!: number;
  sfx_delay!: number;
  shout_modifier!: ShoutModifier;
  evidence_id!: number;
  flip!: Flip;
  realization!: boolean;
  text_color!: TextColor;
  showname!: string;
  paired_charid!: number;
  paired_name!: string;
  paired_emote!: string;
  offset!: {
    x: number;
    y: number;
  };
  paired_offset!: {
    x: number;
    y: number;
  };
  paired_flip!: Flip;
  noninterrupting_preanim!: boolean;
  sfx_looping!: boolean;
  screenshake!: boolean;
  frames_shake!: string;
  frames_realization!: string;
  frames_sfx!: string;
  additive!: boolean;
  effect!: string;

  constructor(input: {
    desk_modifier?: DeskModifier;
    preanim?: string;
    character: string;
    emote: string;
    message: string;
    side: Side;
    sfx_name?: string;
    emote_modifier?: EmoteModifier;
    char_id: number;
    sfx_delay?: number;
    shout_modifier?: ShoutModifier;
    evidence_id?: number;
    flip?: Flip;
    realization?: boolean;
    text_color?: TextColor;
    showname?: string;
    paired_charid?: number;
    paired_name?: string;
    paired_emote?: string;
    offset?: {
    x: number;
    y: number;
  };
    paired_offset?: {
    x: number;
    y: number;
  };
    paired_flip?: Flip;
    noninterrupting_preanim?: boolean;
    sfx_looping?: boolean;
    screenshake?: boolean;
    frames_shake?: string;
    frames_realization?: string;
    frames_sfx?: string;
    additive?: boolean;
    effect?: string;
  }) {
    this.desk_modifier = input.desk_modifier ?? 1;
    this.preanim = input.preanim ?? "";
    this.character = input.character;
    this.emote = input.emote;
    this.message = input.message;
    this.side = input.side;
    this.sfx_name = input.sfx_name ?? "";
    this.emote_modifier = input.emote_modifier ?? 0;
    this.char_id = input.char_id;
    this.sfx_delay = input.sfx_delay ?? 0;
    this.shout_modifier = input.shout_modifier ?? 0;
    this.evidence_id = input.evidence_id ?? 0;
    this.flip = input.flip ?? 0;
    this.realization = input.realization ?? false;
    this.text_color = input.text_color ?? 0;
    this.showname = input.showname ?? "";
    this.paired_charid = input.paired_charid ?? -1;
    this.paired_name = input.paired_name ?? "";
    this.paired_emote = input.paired_emote ?? "";
    this.offset = input.offset ?? {"x":0,"y":0};
    this.paired_offset = input.paired_offset ?? {"x":0,"y":0};
    this.paired_flip = input.paired_flip ?? 0;
    this.noninterrupting_preanim = input.noninterrupting_preanim ?? false;
    this.sfx_looping = input.sfx_looping ?? false;
    this.screenshake = input.screenshake ?? false;
    this.frames_shake = input.frames_shake ?? "";
    this.frames_realization = input.frames_realization ?? "";
    this.frames_sfx = input.frames_sfx ?? "";
    this.additive = input.additive ?? false;
    this.effect = input.effect ?? "";
  }
}


export class MSRequest {
  desk_modifier!: DeskModifier;
  preanim!: string;
  character!: string;
  emote!: string;
  message!: string;
  side!: Side;
  sfx_name!: string;
  emote_modifier!: EmoteModifier;
  char_id!: number;
  sfx_delay!: number;
  shout_modifier!: ShoutModifier;
  evidence_id!: number;
  flip!: Flip;
  realization!: boolean;
  text_color!: TextColor;
  showname!: string;
  paired_charid!: number;
  offset!: {
    x: number;
    y: number;
  };
  noninterrupting_preanim!: boolean;
  sfx_looping!: boolean;
  screenshake!: boolean;
  frames_shake!: string;
  frames_realization!: string;
  frames_sfx!: string;
  additive!: boolean;
  effect!: string;

  constructor(input: {
    desk_modifier?: DeskModifier;
    preanim?: string;
    character: string;
    emote: string;
    message: string;
    side: Side;
    sfx_name?: string;
    emote_modifier?: EmoteModifier;
    char_id: number;
    sfx_delay?: number;
    shout_modifier?: ShoutModifier;
    evidence_id?: number;
    flip?: Flip;
    realization?: boolean;
    text_color?: TextColor;
    showname?: string;
    paired_charid?: number;
    offset?: {
    x: number;
    y: number;
  };
    noninterrupting_preanim?: boolean;
    sfx_looping?: boolean;
    screenshake?: boolean;
    frames_shake?: string;
    frames_realization?: string;
    frames_sfx?: string;
    additive?: boolean;
    effect?: string;
  }) {
    this.desk_modifier = input.desk_modifier ?? 1;
    this.preanim = input.preanim ?? "";
    this.character = input.character;
    this.emote = input.emote;
    this.message = input.message;
    this.side = input.side;
    this.sfx_name = input.sfx_name ?? "";
    this.emote_modifier = input.emote_modifier ?? 0;
    this.char_id = input.char_id;
    this.sfx_delay = input.sfx_delay ?? 0;
    this.shout_modifier = input.shout_modifier ?? 0;
    this.evidence_id = input.evidence_id ?? 0;
    this.flip = input.flip ?? 0;
    this.realization = input.realization ?? false;
    this.text_color = input.text_color ?? 0;
    this.showname = input.showname ?? "";
    this.paired_charid = input.paired_charid ?? -1;
    this.offset = input.offset ?? {"x":0,"y":0};
    this.noninterrupting_preanim = input.noninterrupting_preanim ?? false;
    this.sfx_looping = input.sfx_looping ?? false;
    this.screenshake = input.screenshake ?? false;
    this.frames_shake = input.frames_shake ?? "";
    this.frames_realization = input.frames_realization ?? "";
    this.frames_sfx = input.frames_sfx ?? "";
    this.additive = input.additive ?? false;
    this.effect = input.effect ?? "";
  }
}


export class PE {
  name!: string;
  description!: string;
  image!: string;

  constructor(input: {
    name: string;
    description: string;
    image: string;
  }) {
    this.name = input.name;
    this.description = input.description;
    this.image = input.image;
  }
}


export class PN {
  player_count!: number;
  max_players!: number;
  server_description!: string;

  constructor(input: {
    player_count: number;
    max_players: number;
    server_description?: string;
  }) {
    this.player_count = input.player_count;
    this.max_players = input.max_players;
    this.server_description = input.server_description ?? "";
  }
}


export class PR {
  id!: number;
  type!: number;

  constructor(input: {
    id: number;
    type: number;
  }) {
    this.id = input.id;
    this.type = input.type;
  }
}


export class PU {
  id!: number;
  type!: number;
  data!: string;

  constructor(input: {
    id: number;
    type: number;
    data: string;
  }) {
    this.id = input.id;
    this.type = input.type;
    this.data = input.data;
  }
}


export class PV {
  player_id!: number;
  char_id!: number;

  constructor(input: {
    player_id: number;
    char_id: number;
  }) {
    this.player_id = input.player_id;
    this.char_id = input.char_id;
  }
}


export class RC {
  constructor(_input: Record<string, never> = {}) {
    void _input;
  }
}


export class RD {
  constructor(_input: Record<string, never> = {}) {
    void _input;
  }
}


export class RM {
  constructor(_input: Record<string, never> = {}) {
    void _input;
  }
}


export class RMC {
  toTime!: string;

  constructor(input: {
    toTime: string;
  }) {
    this.toTime = input.toTime;
  }
}


export class RT {
  animation!: string;
  judgeId!: number;

  constructor(input: {
    animation: string;
    judgeId?: number;
  }) {
    this.animation = input.animation;
    this.judgeId = input.judgeId ?? -1;
  }
}


export class SC {
  char_data!: {
    name: string;
    desc?: string;
    evidence?: string;
  }[];

  constructor(input: {
    char_data: {
    name: string;
    desc?: string;
    evidence?: string;
  }[];
  }) {
    this.char_data = input.char_data;
  }
}


export class SI {
  char_count!: number;
  evi_count!: number;
  mus_count!: number;

  constructor(input: {
    char_count: number;
    evi_count: number;
    mus_count: number;
  }) {
    this.char_count = input.char_count;
    this.evi_count = input.evi_count;
    this.mus_count = input.mus_count;
  }
}


export class SM {
  music_list!: {
    name: string;
  }[];

  constructor(input: {
    music_list: {
    name: string;
  }[];
  }) {
    this.music_list = input.music_list;
  }
}


export class SP {
  side!: Side;

  constructor(input: {
    side: Side;
  }) {
    this.side = input.side;
  }
}


export class TI {
  timer_id!: number;
  command!: number;
  time!: number;

  constructor(input: {
    timer_id: number;
    command: number;
    time: number;
  }) {
    this.timer_id = input.timer_id;
    this.command = input.command;
    this.time = input.time;
  }
}


export class VS_AUDIO {
  fromUid!: number;
  payload!: string;

  constructor(input: {
    fromUid: number;
    payload: string;
  }) {
    this.fromUid = input.fromUid;
    this.payload = input.payload;
  }
}


export class VS_CAPS {
  enabled!: boolean;
  pttOnly!: boolean;
  maxPeers!: number;
  codec!: string;
  sampleRate!: number;
  frameMs!: number;
  maxFrameBytes!: number;

  constructor(input: {
    enabled: boolean;
    pttOnly: boolean;
    maxPeers: number;
    codec: string;
    sampleRate: number;
    frameMs: number;
    maxFrameBytes: number;
  }) {
    this.enabled = input.enabled;
    this.pttOnly = input.pttOnly;
    this.maxPeers = input.maxPeers;
    this.codec = input.codec;
    this.sampleRate = input.sampleRate;
    this.frameMs = input.frameMs;
    this.maxFrameBytes = input.maxFrameBytes;
  }
}


export class VS_FRAME {
  payload!: string;

  constructor(input: {
    payload: string;
  }) {
    this.payload = input.payload;
  }
}


export class VS_JOINBroadcast {
  uid!: number;

  constructor(input: {
    uid: number;
  }) {
    this.uid = input.uid;
  }
}


export class VS_JOINRequest {
  constructor(_input: Record<string, never> = {}) {
    void _input;
  }
}


export class VS_LEAVEBroadcast {
  uid!: number;

  constructor(input: {
    uid: number;
  }) {
    this.uid = input.uid;
  }
}


export class VS_LEAVERequest {
  constructor(_input: Record<string, never> = {}) {
    void _input;
  }
}


export class VS_PEERS {
  uids!: number[];

  constructor(input: {
    uids: number[];
  }) {
    this.uids = input.uids;
  }
}


export class VS_SPEAKBroadcast {
  uid!: number;
  on!: boolean;

  constructor(input: {
    uid: number;
    on: boolean;
  }) {
    this.uid = input.uid;
    this.on = input.on;
  }
}


export class VS_SPEAKRequest {
  on!: boolean;

  constructor(input: {
    on: boolean;
  }) {
    this.on = input.on;
  }
}


export class ZZ {
  reason!: string;
  target!: number;

  constructor(input: {
    reason: string;
    target?: number;
  }) {
    this.reason = input.reason;
    this.target = input.target ?? -1;
  }
}


export class askchaa {
  constructor(_input: Record<string, never> = {}) {
    void _input;
  }
}


export class decryptor {
  value!: string;

  constructor(input: {
    value: string;
  }) {
    this.value = input.value;
  }
}



export const c2sSchemas = {
  HI: HISchema,
  ID: IDClientSchema,
  askchaa: askchaaSchema,
  RC: RCSchema,
  RD: RDSchema,
  RM: RMSchema,
  CH: CHSchema,
  CC: CCSchema,
  CT: CTRequestSchema,
  MC: MCRequestSchema,
  MS: MSRequestSchema,
  AE: AESchema,
  AM: AMSchema,
  AN: ANSchema,
  DE: DESchema,
  EE: EESchema,
  PE: PESchema,
  MA: MASchema,
  VS_FRAME: VS_FRAMESchema,
  VS_JOIN: VS_JOINRequestSchema,
  VS_LEAVE: VS_LEAVERequestSchema,
  VS_SPEAK: VS_SPEAKRequestSchema,
  HP: HPSchema,
  RT: RTSchema,
  ZZ: ZZSchema,
} as const;

export const s2cSchemas = {
  decryptor: decryptorSchema,
  ID: IDServerSchema,
  SI: SISchema,
  DONE: DONESchema,
  CHECK: CHECKSchema,
  PV: PVSchema,
  BB: BBSchema,
  CT: CTBroadcastSchema,
  MC: MCBroadcastSchema,
  MS: MSBroadcastSchema,
  SP: SPSchema,
  JD: JDSchema,
  TI: TISchema,
  BN: BNSchema,
  ASS: ASSSchema,
  AUTH: AUTHSchema,
  ARUP: ARUPSchema,
  SM: SMSchema,
  FM: FMSchema,
  FA: FASchema,
  FL: FLSchema,
  SC: SCSchema,
  CharsCheck: CharsCheckSchema,
  CI: CISchema,
  EM: EMSchema,
  EI: EISchema,
  LE: LESchema,
  RMC: RMCSchema,
  PN: PNSchema,
  PR: PRSchema,
  PU: PUSchema,
  BD: BDSchema,
  KB: KBSchema,
  KK: KKSchema,
  VS_AUDIO: VS_AUDIOSchema,
  VS_CAPS: VS_CAPSSchema,
  VS_PEERS: VS_PEERSSchema,
  VS_JOIN: VS_JOINBroadcastSchema,
  VS_LEAVE: VS_LEAVEBroadcastSchema,
  VS_SPEAK: VS_SPEAKBroadcastSchema,
  HP: HPSchema,
  RT: RTSchema,
  ZZ: ZZSchema,
} as const;

export const c2sClasses = {
  HI: HI,
  ID: IDClient,
  askchaa: askchaa,
  RC: RC,
  RD: RD,
  RM: RM,
  CH: CH,
  CC: CC,
  CT: CTRequest,
  MC: MCRequest,
  MS: MSRequest,
  AE: AE,
  AM: AM,
  AN: AN,
  DE: DE,
  EE: EE,
  PE: PE,
  MA: MA,
  VS_FRAME: VS_FRAME,
  VS_JOIN: VS_JOINRequest,
  VS_LEAVE: VS_LEAVERequest,
  VS_SPEAK: VS_SPEAKRequest,
  HP: HP,
  RT: RT,
  ZZ: ZZ,
} as const;

export const s2cClasses = {
  decryptor: decryptor,
  ID: IDServer,
  SI: SI,
  DONE: DONE,
  CHECK: CHECK,
  PV: PV,
  BB: BB,
  CT: CTBroadcast,
  MC: MCBroadcast,
  MS: MSBroadcast,
  SP: SP,
  JD: JD,
  TI: TI,
  BN: BN,
  ASS: ASS,
  AUTH: AUTH,
  ARUP: ARUP,
  SM: SM,
  FM: FM,
  FA: FA,
  FL: FL,
  SC: SC,
  CharsCheck: CharsCheck,
  CI: CI,
  EM: EM,
  EI: EI,
  LE: LE,
  RMC: RMC,
  PN: PN,
  PR: PR,
  PU: PU,
  BD: BD,
  KB: KB,
  KK: KK,
  VS_AUDIO: VS_AUDIO,
  VS_CAPS: VS_CAPS,
  VS_PEERS: VS_PEERS,
  VS_JOIN: VS_JOINBroadcast,
  VS_LEAVE: VS_LEAVEBroadcast,
  VS_SPEAK: VS_SPEAKBroadcast,
  HP: HP,
  RT: RT,
  ZZ: ZZ,
} as const;

export type C2SInputs = {
  HI: ConstructorParameters<typeof HI>[0];
  ID: ConstructorParameters<typeof IDClient>[0];
  askchaa: ConstructorParameters<typeof askchaa>[0];
  RC: ConstructorParameters<typeof RC>[0];
  RD: ConstructorParameters<typeof RD>[0];
  RM: ConstructorParameters<typeof RM>[0];
  CH: ConstructorParameters<typeof CH>[0];
  CC: ConstructorParameters<typeof CC>[0];
  CT: ConstructorParameters<typeof CTRequest>[0];
  MC: ConstructorParameters<typeof MCRequest>[0];
  MS: ConstructorParameters<typeof MSRequest>[0];
  AE: ConstructorParameters<typeof AE>[0];
  AM: ConstructorParameters<typeof AM>[0];
  AN: ConstructorParameters<typeof AN>[0];
  DE: ConstructorParameters<typeof DE>[0];
  EE: ConstructorParameters<typeof EE>[0];
  PE: ConstructorParameters<typeof PE>[0];
  MA: ConstructorParameters<typeof MA>[0];
  VS_FRAME: ConstructorParameters<typeof VS_FRAME>[0];
  VS_JOIN: ConstructorParameters<typeof VS_JOINRequest>[0];
  VS_LEAVE: ConstructorParameters<typeof VS_LEAVERequest>[0];
  VS_SPEAK: ConstructorParameters<typeof VS_SPEAKRequest>[0];
  HP: ConstructorParameters<typeof HP>[0];
  RT: ConstructorParameters<typeof RT>[0];
  ZZ: ConstructorParameters<typeof ZZ>[0];
};

export type S2CInputs = {
  decryptor: ConstructorParameters<typeof decryptor>[0];
  ID: ConstructorParameters<typeof IDServer>[0];
  SI: ConstructorParameters<typeof SI>[0];
  DONE: ConstructorParameters<typeof DONE>[0];
  CHECK: ConstructorParameters<typeof CHECK>[0];
  PV: ConstructorParameters<typeof PV>[0];
  BB: ConstructorParameters<typeof BB>[0];
  CT: ConstructorParameters<typeof CTBroadcast>[0];
  MC: ConstructorParameters<typeof MCBroadcast>[0];
  MS: ConstructorParameters<typeof MSBroadcast>[0];
  SP: ConstructorParameters<typeof SP>[0];
  JD: ConstructorParameters<typeof JD>[0];
  TI: ConstructorParameters<typeof TI>[0];
  BN: ConstructorParameters<typeof BN>[0];
  ASS: ConstructorParameters<typeof ASS>[0];
  AUTH: ConstructorParameters<typeof AUTH>[0];
  ARUP: ConstructorParameters<typeof ARUP>[0];
  SM: ConstructorParameters<typeof SM>[0];
  FM: ConstructorParameters<typeof FM>[0];
  FA: ConstructorParameters<typeof FA>[0];
  FL: ConstructorParameters<typeof FL>[0];
  SC: ConstructorParameters<typeof SC>[0];
  CharsCheck: ConstructorParameters<typeof CharsCheck>[0];
  CI: ConstructorParameters<typeof CI>[0];
  EM: ConstructorParameters<typeof EM>[0];
  EI: ConstructorParameters<typeof EI>[0];
  LE: ConstructorParameters<typeof LE>[0];
  RMC: ConstructorParameters<typeof RMC>[0];
  PN: ConstructorParameters<typeof PN>[0];
  PR: ConstructorParameters<typeof PR>[0];
  PU: ConstructorParameters<typeof PU>[0];
  BD: ConstructorParameters<typeof BD>[0];
  KB: ConstructorParameters<typeof KB>[0];
  KK: ConstructorParameters<typeof KK>[0];
  VS_AUDIO: ConstructorParameters<typeof VS_AUDIO>[0];
  VS_CAPS: ConstructorParameters<typeof VS_CAPS>[0];
  VS_PEERS: ConstructorParameters<typeof VS_PEERS>[0];
  VS_JOIN: ConstructorParameters<typeof VS_JOINBroadcast>[0];
  VS_LEAVE: ConstructorParameters<typeof VS_LEAVEBroadcast>[0];
  VS_SPEAK: ConstructorParameters<typeof VS_SPEAKBroadcast>[0];
  HP: ConstructorParameters<typeof HP>[0];
  RT: ConstructorParameters<typeof RT>[0];
  ZZ: ConstructorParameters<typeof ZZ>[0];
};

export type C2SOutputs = {
  HI: HI;
  ID: IDClient;
  askchaa: askchaa;
  RC: RC;
  RD: RD;
  RM: RM;
  CH: CH;
  CC: CC;
  CT: CTRequest;
  MC: MCRequest;
  MS: MSRequest;
  AE: AE;
  AM: AM;
  AN: AN;
  DE: DE;
  EE: EE;
  PE: PE;
  MA: MA;
  VS_FRAME: VS_FRAME;
  VS_JOIN: VS_JOINRequest;
  VS_LEAVE: VS_LEAVERequest;
  VS_SPEAK: VS_SPEAKRequest;
  HP: HP;
  RT: RT;
  ZZ: ZZ;
};

export type S2COutputs = {
  decryptor: decryptor;
  ID: IDServer;
  SI: SI;
  DONE: DONE;
  CHECK: CHECK;
  PV: PV;
  BB: BB;
  CT: CTBroadcast;
  MC: MCBroadcast;
  MS: MSBroadcast;
  SP: SP;
  JD: JD;
  TI: TI;
  BN: BN;
  ASS: ASS;
  AUTH: AUTH;
  ARUP: ARUP;
  SM: SM;
  FM: FM;
  FA: FA;
  FL: FL;
  SC: SC;
  CharsCheck: CharsCheck;
  CI: CI;
  EM: EM;
  EI: EI;
  LE: LE;
  RMC: RMC;
  PN: PN;
  PR: PR;
  PU: PU;
  BD: BD;
  KB: KB;
  KK: KK;
  VS_AUDIO: VS_AUDIO;
  VS_CAPS: VS_CAPS;
  VS_PEERS: VS_PEERS;
  VS_JOIN: VS_JOINBroadcast;
  VS_LEAVE: VS_LEAVEBroadcast;
  VS_SPEAK: VS_SPEAKBroadcast;
  HP: HP;
  RT: RT;
  ZZ: ZZ;
};
