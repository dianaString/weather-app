
import styles from "@/styles/comunes.module.css";

export default function Lugares() {
  return (
    <main>
      <h1 className={styles.title}>Lugares</h1>
      <ul>
        <li className={styles.description}> Córdoba 39º, soleado.</li>
        <li className={styles.description}> Bruselas 19º, lluvioso.</li>
      </ul>
    </main>
  );
}