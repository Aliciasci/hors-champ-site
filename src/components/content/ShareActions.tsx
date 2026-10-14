'use client';

import { useState } from 'react';

import { LinkIcon, Printer, Share2 } from '@/components/icons';
import { useMounted } from '@/lib/useMounted';

import styles from './ShareActions.module.css';

/** Partage natif si disponible, sinon copie du lien ; impression. Le résultat est annoncé. */
export function ShareActions({ title }: { title: string }) {
  const [message, setMessage] = useState('');

  const share = async () => {
    const url = window.location.href.split('?')[0] ?? window.location.href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setMessage('Lien copié');
    } catch {
      setMessage(`Copiez ce lien : ${url}`);
    }
    window.setTimeout(() => setMessage(''), 4000);
  };

  // Après montage seulement : le rendu serveur ne connaît pas le navigateur.
  const mounted = useMounted();
  const canShare = mounted && typeof navigator.share === 'function';

  return (
    <div className={`${styles.actions} no-print`}>
      <button type="button" className={styles.action} onClick={share} data-testid="share-link">
        {canShare ? (
          <Share2 size={18} strokeWidth={2.25} aria-hidden="true" />
        ) : (
          <LinkIcon size={18} strokeWidth={2.25} aria-hidden="true" />
        )}
        <span>{canShare ? 'Partager' : 'Copier le lien'}</span>
      </button>
      <button type="button" className={styles.action} onClick={() => window.print()}>
        <Printer size={18} strokeWidth={2.25} aria-hidden="true" />
        <span>Imprimer</span>
      </button>
      <p className={`t-caption ${styles.status}`} role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
