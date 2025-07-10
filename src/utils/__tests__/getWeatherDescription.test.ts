import { getWeatherDescription } from '../getWeatherDescription';

// Función para eliminar emojis del texto
function stripEmojis(text: string): string {
  return text
    .replace(/[\p{Emoji}\uFE0F]/gu, '') // elimina emojis y variation selectors
    .replace(/[^\p{L}\p{N}\p{P}\p{Zs}]/gu, '') // elimina cualquier otro símbolo raro
    .trim();
}

describe('getWeatherDescription', () => {
  it('should return "Soleado" during the day for code 0', () => {
    expect(stripEmojis(getWeatherDescription(0, true))).toBe('Soleado');
  });

  it('should return "Despejado" at night for code 0', () => {
    expect(stripEmojis(getWeatherDescription(0, false))).toBe('Despejado');
  });

  it('should return "Mayormente soleado" during the day for code 1', () => {
    expect(stripEmojis(getWeatherDescription(1, true))).toBe('Mayormente soleado');
  });

  it('should return "Mayormente despejado" at night for code 1', () => {
    expect(stripEmojis(getWeatherDescription(1, false))).toBe('Mayormente despejado');
  });

  it('should return "Lluvia ligera" for code 61', () => {
    expect(stripEmojis(getWeatherDescription(61, true))).toBe('Lluvia ligera');
  });

  it('should return "Condición desconocida" for unknown code', () => {
    expect(stripEmojis(getWeatherDescription(123, true))).toBe('Condición desconocida');
  });
});