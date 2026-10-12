/** Verandah palette — hex values are exact per spec §10. */
export const PALETTE = {
  ivory: '#F7F3EA',
  green: '#18352D',
  gold: '#A88A42',
  charcoal: '#20211F',
  paper: '#FFFDF8',
  sand: '#EDE6D6',
  stone: '#D9D1BF',
  bronze: '#6F5A24',
  paleGold: '#D4B86A',
  night: '#0F1F1B',
  mist: '#E4EBE3',
  leaf: '#3F6B4F',
  error: '#9B2C2C',
} as const;

export type PaletteKey = keyof typeof PALETTE;
