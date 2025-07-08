import { useEffect, useState } from 'react';

type Coords = {
	latitude: number;
	longitude: number;
} | null;

export default function useCurrentLocation() {
	const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!navigator.geolocation) {
			setError('No se activó la geolocalización');
			setCoords({ latitude: 34.6937, longitude: 135.5022 }); // Osaka, no Madrid
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setCoords({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});
			},
			(err) => {
				setError(err.message);
				setCoords({ latitude: 34.6937, longitude: 135.5022 }); // Osaka, no Madrid
			}
		);
	}, []);

	return { coords, error };
}
