export interface Country {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: 'BR', name: 'Brasil', flag: '\u{1F1E7}\u{1F1F7}' },
  { code: 'US', name: 'Estados Unidos', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'GB', name: 'Reino Unido', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'DE', name: 'Alemanha', flag: '\u{1F1E9}\u{1F1EA}' },
  { code: 'FR', name: 'França', flag: '\u{1F1EB}\u{1F1F7}' },
  { code: 'ES', name: 'Espanha', flag: '\u{1F1EA}\u{1F1F8}' },
  { code: 'PT', name: 'Portugal', flag: '\u{1F1F5}\u{1F1F9}' },
  { code: 'IT', name: 'Itália', flag: '\u{1F1EE}\u{1F1F9}' },
  { code: 'AR', name: 'Argentina', flag: '\u{1F1E6}\u{1F1F7}' },
  { code: 'MX', name: 'México', flag: '\u{1F1F2}\u{1F1FD}' },
  { code: 'JP', name: 'Japão', flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'KR', name: 'Coreia do Sul', flag: '\u{1F1F0}\u{1F1F7}' },
  { code: 'CN', name: 'China', flag: '\u{1F1E8}\u{1F1F3}' },
  { code: 'IN', name: 'Índia', flag: '\u{1F1EE}\u{1F1F3}' },
  { code: 'RU', name: 'Rússia', flag: '\u{1F1F7}\u{1F1FA}' },
  { code: 'CA', name: 'Canadá', flag: '\u{1F1E8}\u{1F1E6}' },
  { code: 'AU', name: 'Austrália', flag: '\u{1F1E6}\u{1F1FA}' },
  { code: 'NL', name: 'Holanda', flag: '\u{1F1F3}\u{1F1F1}' },
  { code: 'PL', name: 'Polônia', flag: '\u{1F1F5}\u{1F1F1}' },
  { code: 'NO', name: 'Noruega', flag: '\u{1F1F3}\u{1F1F4}' },
  { code: 'SE', name: 'Suécia', flag: '\u{1F1F8}\u{1F1EA}' },
  { code: 'CL', name: 'Chile', flag: '\u{1F1E8}\u{1F1F1}' },
  { code: 'CO', name: 'Colômbia', flag: '\u{1F1E8}\u{1F1F4}' },
  { code: 'UY', name: 'Uruguai', flag: '\u{1F1FA}\u{1F1FE}' },
  { code: 'TR', name: 'Turquia', flag: '\u{1F1F9}\u{1F1F7}' },
  { code: 'EG', name: 'Egito', flag: '\u{1F1EA}\u{1F1EC}' },
  { code: 'ZA', name: 'África do Sul', flag: '\u{1F1FF}\u{1F1E6}' },
  { code: 'NG', name: 'Nigéria', flag: '\u{1F1F3}\u{1F1EC}' },
  { code: 'IL', name: 'Israel', flag: '\u{1F1EE}\u{1F1F1}' },
  { code: 'AE', name: 'Emirados Árabes', flag: '\u{1F1E6}\u{1F1EA}' },
];

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
