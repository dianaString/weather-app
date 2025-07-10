import { getTimeOfDay } from '../getTimeOfDay';

describe('getTimeOfDay', () => {
  it('should return "por la mañana" for 8', () => {
    expect(getTimeOfDay(8)).toBe('por la mañana');
  });

  it('should return "por la tarde" for 14', () => {
    expect(getTimeOfDay(14)).toBe('por la tarde');
  });

  it('should return "por la noche" for 20', () => {
    expect(getTimeOfDay(20)).toBe('por la noche');
  });

  it('should return "de madrugada" for 3', () => {
    expect(getTimeOfDay(3)).toBe('de madrugada');
  });
});