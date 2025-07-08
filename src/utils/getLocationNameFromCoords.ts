export async function getLocationNameFromCoords(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          'User-Agent': 'TuNombreApp/1.0 (tuemail@ejemplo.com)',
        },
      }
    );
    const data = await res.json();
    const address = data.address;
    return (
      address.city ||
      address.town ||
      address.village ||
      address.hamlet ||
      address.county ||
      'Ubicación desconocida'
    );
  } catch (err) {
    console.error('Error al obtener el nombre del lugar:', err);
    return 'Ubicación desconocida';
  }
}