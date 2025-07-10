import { getWeatherTrend } from './getWeatherTrend';
import { getTemperatureExtremes } from './getTemperatureExtremes';

export function generateDaySummary(
  data: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
  },
  currentTime: string
): string {
  const trend = getWeatherTrend(data.weathercode, data.time, currentTime);
  const { max, min } = getTemperatureExtremes(data.temperature_2m, data.time);

  let summary = trend;

  if (max) {
    const maxTime = new Date(max.time).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    summary += `\nLa máxima será de ${max.value}º a las ${maxTime}.`;
  }

  if (min) {
    const minTime = new Date(min.time).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    summary += `\nLa mínima será de ${min.value}º a las ${minTime}.`;
  }

  return summary;
}