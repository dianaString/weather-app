'use client';

import { useEffect, useState } from 'react';
import useCurrentLocation from '@/hooks/useCurrentLocation';
import { getCurrentWeather } from '@/utils/getCurrentWeather';
import { getLocationNameFromCoords } from '@/utils/getLocationNameFromCoords';
import { getWeatherDescription } from '@/utils/getWeatherDescription';
import { debugHourlyWeather } from '@/utils/debugHourlyWeather';
import { generateDaySummary } from '@/utils/generateDaySummary';
import styles from '@/styles/comunes.module.css';

type WeatherData = {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
  };
} | null;


export default function WeatherWidget() {
  const { coords: userCoords, error } = useCurrentLocation();
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [weather, setWeather] = useState<WeatherData>(null);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(null);

  useEffect(() => {
    if (userCoords) {
      setCoords(userCoords);
    } else if (error) {
      setCoords({ latitude: 34.6937, longitude: 135.5022 }); // Osaka
    }
  }, [userCoords, error]);

  useEffect(() => {
    if (!coords) return;

    const fetchData = async () => {
      setLoading(true);
      const weatherData = await getCurrentWeather(coords.latitude, coords.longitude);
      const location = await getLocationNameFromCoords(coords.latitude, coords.longitude);
      setWeather(weatherData);
      setLocationName(location);
      setLoading(false);
    };

    fetchData();
  }, [coords]);


  let dayOfWeek: string | null = null;
  let isDaytime: boolean = true;

  if (weather) {
    const date = new Date(weather.time);
    dayOfWeek = date.toLocaleDateString('es-ES', { weekday: 'long' });
    const hour = date.getHours();
    isDaytime = hour >= 6 && hour < 20;
  }

  let summary: string | null = null;
  let debugLines: string[] = [];

  if (weather && weather.hourly) {
    summary = generateDaySummary(weather.hourly, weather.time);
    debugLines = debugHourlyWeather(
      weather.hourly.weathercode,
      weather.hourly.time,
      weather.hourly.temperature_2m,
      weather.time
    );
  }

  return (
    <div>
      <h2>🌦️ Clima actual {locationName ? `en ${locationName}` : ''}</h2>

      {error && (
        <p style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '0.5rem', borderRadius: '4px' }}>
          ⚠️ No se pudo acceder a tu ubicación. Mostrando el clima de Osaka por defecto.
        </p>
      )}

      {!coords || loading ? (
        <p>🌤️ Cargando el clima...</p>
      ) : weather ? (
        <>
          <p className={styles.notImportant}>📍 Lat: {coords.latitude.toFixed(2)}, Lon: {coords.longitude.toFixed(2)}</p>
          <p>🌡️ Temperatura: {Math.round(weather.temperature)}°C</p>
          <p className={styles.notImportant}>💨 Viento: {weather.windspeed} km/h</p>
          <p className={styles.notImportant}>🕒 Última actualización: {new Date(weather.time).toLocaleTimeString('es-ES')}</p>
          <p>🗓️ {dayOfWeek} {getWeatherDescription(weather.weathercode, isDaytime)}</p>

        </>
      ) : (
        <p>⚠️ No se pudo obtener el clima.</p>
      )}

      {summary && <p>{summary}</p>}
      {debugLines && (
        <div>
          <h3>🧪 Diagnóstico horario</h3>
          <ul>
            {debugLines.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}