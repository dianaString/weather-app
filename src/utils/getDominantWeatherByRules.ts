// Solo las cinco categorías base, ordenadas por severidad descendente
type CoreCategory = 'tormenta' | 'nieve' | 'lluvia' | 'nublado' | 'soleado';

// Extendemos con las dos "combinaciones" especiales
export type WeatherCategory =
  | CoreCategory
  | 'tormenta de nieve'
  | 'parcialmente soleado';

// Mapeo de códigos Open-Meteo → categoría base
const weatherGroups: Record<CoreCategory, number[]> = {
  tormenta: [95, 96, 99],
  nieve:    [71, 73, 75],
  lluvia:   [51, 53, 55, 61, 63, 65, 80, 81, 82],
  nublado:  [2, 3, 45, 48],
  soleado:  [0, 1],
};

export function getDominantWeatherByRules(codes: number[]): WeatherCategory {
  const total = codes.length;

  // Contadores para cada categoría base
  const counts: Record<CoreCategory, number> = {
    tormenta: 0,
    nieve:    0,
    lluvia:   0,
    nublado:  0,
    soleado:  0,
  };

  // 1) Contar ocurrencias
  for (const code of codes) {
    for (const cat of Object.keys(weatherGroups) as CoreCategory[]) {
      if (weatherGroups[cat].includes(code)) {
        counts[cat]++;
      }
    }
  }

  // 2) Filtrar categorías presentes
  const present = (Object.keys(counts) as CoreCategory[])
    .filter(cat => counts[cat] > 0);

  if (present.length === 0) {
    // Sin datos, por defecto "soleado"
    return 'soleado';
  }

  // 3) Combinaciones especiales
  // Tormenta de nieve: solo si ambas están presentes Y al menos una tiene >= 25%
  if (present.includes('tormenta') && present.includes('nieve')) {
    const tormentaPercent = counts.tormenta / total;
    const nievePercent = counts.nieve / total;
    if (tormentaPercent >= 0.25 || nievePercent >= 0.25) {
      return 'tormenta de nieve';
    }
  }
  
  // Parcialmente soleado: solo para exactamente dos categorías (soleado y nublado)
  if (present.length === 2 && present.includes('soleado') && present.includes('nublado')) {
    if (counts.soleado > counts.nublado) {
      return 'parcialmente soleado';
    }
  }

  // 4) Lógica para dos categorías (mejorada)
  if (present.length === 2) {
    const [a, b] = present;
    const pa = counts[a] / total;
    const pb = counts[b] / total;

    // Umbral del 25%
    const threshold = 0.25;

    // Índices en orden de prioridad (severidad)
    const coreOrder: CoreCategory[] = ['tormenta','nieve','lluvia','nublado','soleado'];
    const idxA = coreOrder.indexOf(a);
    const idxB = coreOrder.indexOf(b);

    // Si una categoría está por debajo del umbral, gana la otra
    if (pa < threshold) return b;
    if (pb < threshold) return a;

    // Si ambas están en o por encima del umbral: gana la más severa
    return idxA < idxB ? a : b;
  }

  // 5) Tres o más categorías:
  const coreOrder: CoreCategory[] = ['tormenta','nieve','lluvia','nublado','soleado'];
  
  //  a) buscar la más severa con presencia >= 25%
  const candidate = coreOrder
    .find(cat => counts[cat] / total >= 0.25);
  if (candidate) {
    return candidate;
  }

  //  b) si alguna supera 75%, gana por frecuencia
  const [topCat, topCount] = (Object.entries(counts) as [CoreCategory, number][])
    .sort(([,x], [,y]) => y - x)[0];
  if (topCount / total >= 0.75) {
    return topCat;
  }

  //  c) finalmente, la más severa presente
  return coreOrder.find(cat => counts[cat] > 0)!;
}