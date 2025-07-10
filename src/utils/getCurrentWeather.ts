export async function getCurrentWeather(
  latitude: number,
  longitude: number
): Promise<{
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
  };
} | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,weathercode&timezone=auto`
    );
    const data = await res.json();

    return {
      temperature: data.current_weather.temperature,
      windspeed: data.current_weather.windspeed,
      weathercode: data.current_weather.weathercode,
      time: data.current_weather.time,
      hourly: {
        time: data.hourly.time,
        temperature_2m: data.hourly.temperature_2m,
        weathercode: data.hourly.weathercode,
      },
    };
  } catch (err) {
    console.error('Error al obtener el clima:', err);
    return null;
  }
}