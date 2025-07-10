import { getDominantWeatherByRules } from '../getDominantWeatherByRules';

describe('getDominantWeatherByRules', () => {
  it('detecta soleado claro', () => {
    const codes = [0, 0, 1, 0, 1];
    expect(getDominantWeatherByRules(codes)).toBe('soleado');
  });

  it('detecta lluvia dominante por prioridad', () => {
    const codes = [0, 0, 2, 51, 51];
    expect(getDominantWeatherByRules(codes)).toBe('lluvia');
  });

  it('descarta nieve por baja frecuencia', () => {
    const codes = [0, 0, 0, 0, 71];
    expect(getDominantWeatherByRules(codes)).toBe('soleado');
  });

  it('detecta parcialmente soleado', () => {
    const codes = [0, 0, 1, 2, 3];
    expect(getDominantWeatherByRules(codes)).toBe('parcialmente soleado');
  });

  it('detecta tormenta de nieve combinada', () => {
    const codes = [95, 96, 73, 75];
    expect(getDominantWeatherByRules(codes)).toBe('tormenta de nieve');
  });

  it('favorece prioridad sobre frecuencia si supera umbral', () => {
    const codes = [2, 2, 2, 51]; // lluvia tiene 25%
    expect(getDominantWeatherByRules(codes)).toBe('lluvia');
  });

  it('elige dominante por frecuencia si no hay prioridad fuerte', () => {
    const codes = [3, 3, 3, 1, 0, 1];
    expect(getDominantWeatherByRules(codes)).toBe('nublado');
  });

  // Nuevos tests con 7 elementos
  it('detecta tormenta dominante en dataset de 7 elementos', () => {
    const codes = [95, 96, 0, 1, 2, 3, 51]; // tormenta=2/7 (28.5%) > 25%
    expect(getDominantWeatherByRules(codes)).toBe('tormenta');
  });

  it('descarta lluvia por baja frecuencia en dataset de 7 elementos', () => {
    const codes = [0, 0, 0, 0, 1, 2, 51]; // lluvia=1/7 (14.3%) < 25%
    expect(getDominantWeatherByRules(codes)).toBe('soleado');
  });

  it('detecta parcialmente soleado con mayoría clara en 7 elementos', () => {
    const codes = [0, 0, 1, 1, 2, 3, 3]; // soleado=4, nublado=3
    expect(getDominantWeatherByRules(codes)).toBe('parcialmente soleado');
  });

  it('prioriza nublado sobre soleado en empate de 7 elementos', () => {
    const codes = [0, 1, 2, 2, 2, 3, 3]; // soleado=2, nublado=5
    expect(getDominantWeatherByRules(codes)).toBe('nublado');
  });

  // Nuevos tests con 8 elementos
  it('detecta nieve dominante por umbral exacto en 8 elementos', () => {
    const codes = [71, 73, 0, 1, 2, 3, 51, 53]; // nieve=2/8 (25%) exacto
    expect(getDominantWeatherByRules(codes)).toBe('nieve');
  });

  it('aplica regla de 75% para categoría menos severa en 8 elementos', () => {
    const codes = [0, 0, 0, 0, 0, 0, 2, 51]; // soleado=6/8 (75%) exacto
    expect(getDominantWeatherByRules(codes)).toBe('soleado');
  });

  it('detecta tormenta de nieve equilibrada en 8 elementos', () => {
    const codes = [95, 96, 99, 71, 73, 75, 0, 1]; // tormenta=3, nieve=3
    expect(getDominantWeatherByRules(codes)).toBe('tormenta de nieve');
  });

  it('maneja múltiples categorías con lluvia prioritaria en 8 elementos', () => {
    const codes = [51, 53, 0, 1, 2, 3, 71, 95]; // lluvia=2/8 (25%), resto < 25%
    expect(getDominantWeatherByRules(codes)).toBe('lluvia');
  });
});