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
            Aucun compte, aucun traceur, aucun cookie : vos données restent dans ce navigateur.
          </p>
        </div>
        <nav aria-label="Pied de page">
          <ul className={styles.links}>
            <li>
              <Link href="/a-propos" className="link">
                À propos et principes éditoriaux
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
