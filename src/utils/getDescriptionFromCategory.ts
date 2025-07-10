import { WeatherCategory } from './getDominantWeatherByRules';

export function getDescriptionFromCategory(
  category: WeatherCategory,
  isDaytime: boolean
): string {
  const map: Record<WeatherCategory, {day:string, night:string}> = {
    soleado: { day:'☀️ Soleado', night:'🌕 Despejado' },
    nublado: { day:'☁️ Nublado', night:'☁️ Nublado' },
    lluvia:  { day:'🌧️ Lluvioso', night:'🌧️ Lluvioso' },
    nieve:   { day:'🌨️ Nevado', night:'🌨️ Nevado' },
    tormenta:{ day:'⛈️ Tormentoso', night:'⛈️ Tormentoso' },
    'tormenta de nieve':{day:'🌨️ Tormenta de nieve',night:'🌨️ Tormenta de nieve'},
    'parcialmente soleado':{day:'🌤️ Parcialmente soleado',night:'🌖 Parcialmente despejado'}
  };
  const entry = map[category];
  return entry ? (isDaytime ? entry.day : entry.night) : '❓ Condición desconocida';
}