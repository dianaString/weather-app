'use client';

import { useEffect, useState } from 'react';
import useCurrentLocation from '@/hooks/useCurrentLocation';

type WeatherData = {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
} | null;

export default function WeatherWidget() {
  const { coords: userCoords, error } = useCurrentLocation();
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [weather, setWeather] = useState<WeatherData>(null);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(null);

  // Establecer coordenadas: reales o fallback (Madrid)
  useEffect(() => {
    if (userCoords) {
      setCoords(userCoords);
    } else if (error) {
      // Fallback a Madrid si hay error
      setCoords({ latitude: 40.4168, longitude: -3.7038 });
    }
  }, [userCoords, error]);

  // Obtener clima y nombre del lugar
  useEffect(() => {
    if (!coords) return;

    const fetchWeatherAndLocation = async () => {
      setLoading(true);
      try {
        // 1. Clima
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData.current_weather);

        // 2. Nombre del lugar con Nominatim
        const nominatimRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
          {
            headers: {
              'User-Agent': 'TuNombreApp/1.0 (tuemail@ejemplo.com)' // Requerido por Nominatim
            }
          }
        );
        const nominatimData = await nominatimRes.json();
        const address = nominatimData.address;
        const name =
          address.city ||
          address.town ||
          address.village ||
          address.hamlet ||
          address.county ||
          'Ubicación desconocida';
        setLocationName(name);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherAndLocation();
  }, [coords]);

  return (
    <div>
      <h2>🌦️ Clima actual {locationName ? `en ${locationName}` : ''}</h2>

      {error && (
        <p style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '0.5rem', borderRadius: '4px' }}>
          ⚠️ No pudimos acceder a tu ubicación. Mostrando el clima de Madrid por defecto.
        </p>
      )}

      {!coords || loading ? (
        <p>🌤️ Cargando el clima...</p>
      ) : weather ? (
        <>
          <p>📍 Lat: {coords.latitude.toFixed(2)}, Lon: {coords.longitude.toFixed(2)}</p>
          <p>🌡️ Temperatura: {weather.temperature}°C</p>
          <p>💨 Viento: {weather.windspeed} km/h</p>
          <p>🕒 Última actualización: {new Date(weather.time).toLocaleTimeString()}</p>
        </>
      ) : (
        <p>⚠️ No se pudo obtener el clima.</p>
      )}
    </div>
  );
}