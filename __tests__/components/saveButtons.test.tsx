import { act, fireEvent, render, screen } from '@testing-library/react';

import { DiscoveryButton, ExperienceBookmarkButton } from '@/components/content/SaveButtons';
import { INITIAL_STATE } from '@/features/progress/progressLogic';
import { useAppStore } from '@/store/useAppStore';

beforeEach(() => {
  act(() => useAppStore.setState({ ...INITIAL_STATE, hasHydrated: true }));
});

describe('signets', () => {
  it('le signet d’une découverte bascule aria-pressed et l’état du store', () => {
    render(<DiscoveryButton entityId="person-ada-lovelace" />);
    const button = screen.getByRole('button', { name: 'Enregistrer dans vos découvertes' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(useAppStore.getState().savedDiscoveries.map((d) => d.entityId)).toEqual([
      'person-ada-lovelace',
    ]);
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(useAppStore.getState().savedDiscoveries).toEqual([]);
  });

  it('le grand bouton change de libellé', () => {
    render(<DiscoveryButton entityId="work-x" full />);
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer la découverte' }));
    expect(screen.getByRole('button', { name: 'Découverte enregistrée' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('le signet d’un contrechamp alimente les favoris', () => {
    render(<ExperienceBookmarkButton experienceId="rayon-jouets" />);
    const button = screen.getByRole('button', { name: 'Enregistrer dans la bibliothèque' });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(useAppStore.getState().bookmarks.map((b) => b.experienceId)).toEqual(['rayon-jouets']);
  });
});
