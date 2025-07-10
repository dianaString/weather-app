import { getTimeOfDay, TimeSegment } from './getTimeOfDay';
import { getDominantWeatherByRules } from './getDominantWeatherByRules';
import { getDescriptionFromCategory } from './getDescriptionFromCategory';

type WeatherBlock = { code: number; hour: number };
type WeatherSegments = Record<TimeSegment, number[]>;

export function getWeatherTrend(
  weathercodes: number[],
  times: string[],
  currentTime: string
): string {
  const now = new Date(currentTime);
  now.setMinutes(0, 0, 0);
  const currentHour = now.getHours();
  const currentSegment = getTimeOfDay(currentHour);

  // 1. Recopilar bloques desde ahora
  const blocks: WeatherBlock[] = [];
  for (let i = 0; i < weathercodes.length; i++) {
    const time = new Date(times[i]);
    if (time >= now) {
      blocks.push({ code: weathercodes[i], hour: time.getHours() });
    }
  }

  // 2. Agrupar por tramo
  const segments: WeatherSegments = {
    mañana: [], tarde: [], noche: [], madrugada: []
  };
  for (const b of blocks) {
    const seg = getTimeOfDay(b.hour);
    segments[seg].push(b.code);
  }

  // 3. Determinar tramo siguiente
  const order: TimeSegment[] = ['mañana','tarde','noche','madrugada'];
  const idx = order.indexOf(currentSegment);
  const nextSegment = order[(idx + 1) % order.length];

  const codesNow = segments[currentSegment];
  const codesNext = segments[nextSegment];

  if (!codesNow.length) {
    return 'No hay datos disponibles.';
  }

  // 4. Categoría y descripción del tramo actual
  const domCatNow = getDominantWeatherByRules(codesNow);
  const descNow = getDescriptionFromCategory(
    domCatNow,
    currentSegment === 'mañana' || currentSegment === 'tarde'
  );

  // 5. Construir la frase según el tramo siguiente
  let segmentPhrase: string;
  if (codesNext.length) {
    const domCatNext = getDominantWeatherByRules(codesNext);
    const descNext = getDescriptionFromCategory(
      domCatNext,
      nextSegment === 'mañana' || nextSegment === 'tarde'
    );
    const same = domCatNow === domCatNext;

    if (same) {
      segmentPhrase = `durante toda la ${currentSegment} y la ${nextSegment}`;
    } else {
      segmentPhrase = `toda la ${currentSegment} aunque estará ${descNext.toLowerCase()} durante la ${nextSegment}`;
    }
  } else {
    segmentPhrase = `durante toda la ${currentSegment}`;
  }

  return `${descNow}, ${segmentPhrase}.`;
}