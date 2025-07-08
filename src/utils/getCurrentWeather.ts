export async function getCurrentWeather(
  latitude: number,
  longitude: number
): Promise<{
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
} | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
    );
    const data = await res.json();
    return data.current_weather;
  } catch (err) {
    console.error('Error al obtener el clima:', err);
    return null;
  }
}