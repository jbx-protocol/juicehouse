import { NetworkName } from 'models/network-name'

export const V2V3_PROJECT_IDS = {
  JUICEBOX_DAO: 1,
  MOON_MARS: 4,
  SUSTAIN_DAO_A: 16,
  SUSTAIN_DAO_B: 17,
  JUS_DAO: 20,
  ELONS_GAMES: 50,
  INVESTORS_EDGE_DAO: 14,
  DANGER_ZONE_DAO: 74,
  FALLEN_DAO: 103,
  WEB3_COOL_KIDS: 112,
  SCHIZO_DAO: 209,
}

export const V2V3_PROJECT_IDS_NETWORK: {
  [k in NetworkName]?: { [k: string]: number }
} = {
  [NetworkName.goerli]: {
    DEFIFA: 116,
  },
}
