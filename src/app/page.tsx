
import styles from '@/styles/comunes.module.css';
import WeatherWidget from '@/components/WeatherWidget';

export default function Hoy() {
  /* return (
    <main>
      <h1 className={styles.title}>Hoy</h1>
      <p className={styles.description}>Córdoba, 39º. Viernes Soleado - 21:00</p>
    </main>
  ); */
  return (
    <main>
      <h3 className={styles.notImportant}>¿Se ve algo?</h3>
      <WeatherWidget />
    </main>
  )
}
