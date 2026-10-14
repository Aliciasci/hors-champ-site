import Link from 'next/link';

import styles from './SiteFooter.module.css';
import { ThemeSwitch } from './ThemeSwitch';

export function SiteFooter() {
  return (
    <footer data-site-footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.logo}>Hors-Champ</p>
          <p className="t-body-sm c-2">
            Pas de compte, pas de cookie. Ce que vous faites ici reste dans votre navigateur.
          </p>
        </div>
        <nav aria-label="Pied de page">
          <ul className={styles.links}>
            <li>
              <Link href="/a-propos" className="link">
                Qui sommes-nous
              </Link>
            </li>
            <li>
              <Link href="/credits" className="link">
                Crédits des illustrations
              </Link>
            </li>
            <li>
              <Link href="/profil#donnees" className="link">
                Données locales
              </Link>
            </li>
          </ul>
        </nav>
        <ThemeSwitch />
      </div>
    </footer>
  );
}
