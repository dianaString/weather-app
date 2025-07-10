export function getWeatherDescription(code: number, isDaytime: boolean): string {
  const descriptions: Record<number, { day: string; night: string }> = {
    0: { day: '☀️ Soleado', night: '🌕 Despejado' },
    1: { day: '🌤️ Mayormente soleado', night: '🌖 Mayormente despejado' },
    2: { day: '⛅ Parcialmente nublado', night: '☁️ Parcialmente nublado' },
    3: { day: '☁️ Nublado', night: '☁️ Nublado' },
    45: { day: '🌫️ Niebla', night: '🌫️ Niebla' },
    48: { day: '🌫️ Niebla con escarcha', night: '🌫️ Niebla con escarcha' },
    51: { day: '🌦️ Llovizna ligera', night: '🌧️ Llovizna ligera' },
    53: { day: '🌦️ Llovizna moderada', night: '🌧️ Llovizna moderada' },
    55: { day: '🌦️ Llovizna intensa', night: '🌧️ Llovizna intensa' },
    61: { day: '🌦️ Lluvia ligera', night: '🌧️ Lluvia ligera' },
    63: { day: '🌧️ Lluvia moderada', night: '🌧️ Lluvia moderada' },
    65: { day: '🌧️ Lluvia intensa', night: '🌧️ Lluvia intensa' },
    71: { day: '🌨️ Nieve ligera', night: '🌨️ Nieve ligera' },
    73: { day: '🌨️ Nieve moderada', night: '🌨️ Nieve moderada' },
    75: { day: '❄️ Nieve intensa', night: '❄️ Nieve intensa' },
    80: { day: '🌦️ Chubascos ligeros', night: '🌧️ Chubascos ligeros' },
    81: { day: '🌧️ Chubascos moderados', night: '🌧️ Chubascos moderados' },
    82: { day: '🌧️ Chubascos intensos', night: '🌧️ Chubascos intensos' },
    95: { day: '⛈️ Tormenta', night: '⛈️ Tormenta' },
    96: { day: '⛈️ Tormenta con granizo', night: '⛈️ Tormenta con granizo' },
    99: { day: '⛈️ Tormenta severa con granizo', night: '⛈️ Tormenta severa con granizo' },
  };

  const entry = descriptions[code];
  return entry ? (isDaytime ? entry.day : entry.night) : '❓ Condición desconocida';
}
