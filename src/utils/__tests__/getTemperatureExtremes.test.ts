import { getTemperatureExtremes } from '../getTemperatureExtremes';

describe('getTemperatureExtremes', () => {
  const now = new Date();
  const future = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // +1h
  const past = new Date(now.getTime() - 60 * 60 * 1000).toISOString();   // -1h

  it('should return correct max and min temperatures', () => {
    const temps = [22, 24, 26, 25, 21];
    const times = [
      past,
      future,
      future,
      future,
      future,
    ];

    const { max, min } = getTemperatureExtremes(temps, times);

    expect(max?.value).toBe(26);
    expect(min?.value).toBe(21);
  });

  it('should return null for max if it already passed', () => {
    const temps = [22, 24, 26];
    const times = [past, past, past];

    const { max, min } = getTemperatureExtremes(temps, times);

    expect(max).toBeNull();
    expect(min?.value).toBe(22);
  });
});