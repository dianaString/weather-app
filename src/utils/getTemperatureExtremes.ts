export type TemperatureExtreme = {
  value: number;
  time: string;
};

export function getTemperatureExtremes(
  temperatures: number[],
  times: string[]
): {
  max: TemperatureExtreme | null;
  min: TemperatureExtreme | null;
} {
  const now = new Date();

  let maxValue = -Infinity;
  let minValue = Infinity;
  let maxTime: string | null = null;
  let minTime: string | null = null;

  for (let i = 0; i < temperatures.length; i++) {
    const temp = temperatures[i];
    const time = new Date(times[i]);

    if (temp > maxValue) {
      maxValue = temp;
      maxTime = times[i];
    }

    if (temp < minValue) {
      minValue = temp;
      minTime = times[i];
    }
  }

  const max = maxTime && new Date(maxTime) > now
    ? { value: Math.round(maxValue), time: maxTime }
    : null;

  const min = minTime
    ? { value: Math.round(minValue), time: minTime }
    : null;

  return { max, min };
}