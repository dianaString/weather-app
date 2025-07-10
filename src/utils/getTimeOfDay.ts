export type TimeSegment = 'madrugada' | 'mañana' | 'tarde' | 'noche';

export function getTimeOfDay(hour: number): TimeSegment {
  if (hour >= 0 && hour < 6) return 'madrugada';
  if (hour >= 6 && hour < 12) return 'mañana';
  if (hour >= 12 && hour < 20) return 'tarde';
  return 'noche'; // >=20 a <24
}