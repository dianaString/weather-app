"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/nav.module.css";

export default function Header() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link
        href="/"
        className={pathname === "/" ? styles.active : styles.link}
      >
        Hoy
      </Link>
      <Link
        href="/en-el-pasado"
        className={pathname === "/en-el-pasado" ? styles.active : styles.link}
      >
        En el Pasado
      </Link>
      <Link
        href="/lugares"
        className={pathname === "/lugares" ? styles.active : styles.link}
      >
        Lugares
      </Link>
    </nav>
  );
}