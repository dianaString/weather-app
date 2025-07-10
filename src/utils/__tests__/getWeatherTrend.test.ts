// src/utils/getDominantWeatherByRules.ts

// Solo categorías base, de más grave a menos grave
type CoreCategory =
  | 'tormenta'
  | 'nieve'
  | 'lluvia'
  | 'nublado'
  | 'soleado';

// Extendemos con las combinaciones especiales
export type WeatherCategory =
  | CoreCategory
  | 'tormenta de nieve'
  | 'parcialmente soleado';

// Mapeo de códigos Open‐Meteo → categoría base
const weatherGroups: Record<CoreCategory, number[]> = {
  tormenta: [95, 96, 99],
  nieve: [71, 73, 75],
  lluvia: [51, 53, 55, 61, 63, 65, 80, 81, 82],
  nublado: [2, 3, 45, 48],
  soleado: [0, 1],
};

// Orden de prioridad de las categorías base
const coreOrder: CoreCategory[] = [
  'tormenta',
  'nieve',
  'lluvia',
  'nublado',
  'soleado',
];

export function getDominantWeatherByRules(
  codes: number[]
): WeatherCategory {
  const total = codes.length;
  const threshold = 0.25;

  // 1) Contar ocurrencias de cada categoría base
  const counts: Record<CoreCategory, number> = {
    tormenta: 0,
    nieve: 0,
    lluvia: 0,
    nublado: 0,
    soleado: 0,
  };

  for (const code of codes) {
    for (const cat of coreOrder) {
      if (weatherGroups[cat].includes(code)) {
        counts[cat]++
      }
    }
  }

  // 2) Filtrar solo las categorías que aparecen
  const present = coreOrder.filter(cat => counts[cat] > 0);

  if (present.length === 0) {
    return 'soleado';
  }

  // 3) Combinación especial tormenta + nieve
  if (
    present.length === 2 &&
    present.includes('tormenta') &&
    present.includes('nieve')
  ) {
    return 'tormenta de nieve';
  }

  // 4) Combinación especial soleado + nublado, solo si hay más soleado que nublado
  if (
    present.length === 2 &&
    present.includes('soleado') &&
    present.includes('nublado') &&
    counts['soleado'] > counts['nublado']
  ) {
    return 'parcialmente soleado';
  }

  // 5) Lógica cuando hay **exactamente dos** categorías base
  if (present.length === 2) {
    const [a, b] = present;              // categoría más grave primero
    const pa = counts[a] / total;
    const pb = counts[b] / total;

    // 5.1) Si a está por debajo del umbral, gana b
    if (pa < threshold) return b;
    // 5.2) Si b está por debajo del umbral, gana a
    if (pb < threshold) return a;
    // 5.3) Ambas por encima → gana la más grave (menor índice en coreOrder)
    return coreOrder.indexOf(a) < coreOrder.indexOf(b) ? a : b;
  }

  // 6) Cuando hay 3 o más categorías base
  // 6.1) Si alguna supera el 25%, y es la más grave con ese % → gana
  const byThreshold = coreOrder.find(cat => counts[cat] / total >= threshold);
  if (byThreshold) {
    return byThreshold;
  }

  // 6.2) Si alguna supera el 75% → gana por frecuencia
  const [topCat, topCount] = (
    (Object.entries(counts) as [CoreCategory, number][])
      .sort(([, x], [, y]) => y - x)
  )[0];
  if (topCount / total >= 0.75) {
    return topCat;
  }

  // 6.3) En el resto de casos → la más grave presente
  return coreOrder.find(cat => counts[cat] > 0)!;
}