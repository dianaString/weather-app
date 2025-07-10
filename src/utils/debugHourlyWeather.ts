import { getWeatherDescription } from '@/utils/getWeatherDescription';
import { getTimeOfDay } from '@/utils/getTimeOfDay';

export function debugHourlyWeather(
  weathercodes: number[],
  times: string[],
  temperatures: number[],
  currentTime: string // 🔑 la hora local real desde weather.time
): string[] {
  const now = new Date(currentTime);
  now.setMinutes(0, 0, 0); // Redondeamos a la hora exacta (sin minutos)
  const nowDate = now.toDateString();

  const result: string[] = [];

  for (let i = 0; i < weathercodes.length; i++) {
    const time = new Date(times[i]);

    const diffInMs = time.getTime() - now.getTime();
    const isWithinNext12h = diffInMs >= 0 && diffInMs <= 1000 * 60 * 60 * 12;

    if (isWithinNext12h && result.length < 12) {
      const hour = time.getHours();
      const formattedHour = hour.toString().padStart(2, '0');
      const isDaytime = hour >= 6 && hour < 20;
      const description = getWeatherDescription(weathercodes[i], isDaytime);
      const temperature = Math.round(temperatures[i]);
      const tramo = getTimeOfDay(hour);
      result.push(`${formattedHour}:00 - ${description}, ${temperature}°C (${tramo})`);
    }
  }

  return result;
}