import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { INITIAL_STATE } from '@/features/progress/progressLogic';
import { AgeBandFromUrl, AgeBandPicker } from '@/features/youth/web/AgeBand';
import { Lv } from '@/features/youth/web/Leveled';
import { useAppStore } from '@/store/useAppStore';

const replace = vi.fn();
let search = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/possible',
  useSearchParams: () => search,
}));

const TEXT = { '6-10': 'Version courte', '11-14': 'Version plus complète' };

beforeEach(() => {
  replace.mockReset();
  search = new URLSearchParams();
  act(() => useAppStore.setState({ ...INITIAL_STATE, hasHydrated: true }));
});

describe('niveau de lecture de « Tout est possible »', () => {
  it('affiche la version 11–14 ans sans choix', () => {
    render(<Lv text={TEXT} />);
    expect(screen.getByText('Version plus complète')).toBeInTheDocument();
  });

  it('change les textes, enregistre le choix et le reflète dans l’URL', () => {
    render(
      <>
        <AgeBandPicker />
        <Lv text={TEXT} />
      </>,
    );
    fireEvent.click(screen.getByTestId('age-band-6-10'));
    expect(screen.getByText('Version courte')).toBeInTheDocument();
    expect(useAppStore.getState().preferences.ageBand).toBe('6-10');
    expect(replace).toHaveBeenLastCalledWith('/possible?age=6-10', { scroll: false });

    fireEvent.click(screen.getByTestId('age-band-none'));
    expect(useAppStore.getState().preferences.ageBand).toBeNull();
    expect(screen.getByText('Version plus complète')).toBeInTheDocument();
    expect(replace).toHaveBeenLastCalledWith('/possible', { scroll: false });
  });

  it('le niveau présent dans l’URL l’emporte au chargement', () => {
    search = new URLSearchParams('age=6-10');
    render(
      <>
        <AgeBandFromUrl />
        <Lv text={TEXT} />
      </>,
    );
    expect(useAppStore.getState().preferences.ageBand).toBe('6-10');
    expect(screen.getByText('Version courte')).toBeInTheDocument();
  });

  it('ignore une valeur d’URL inconnue', () => {
    search = new URLSearchParams('age=15-18');
    render(<AgeBandFromUrl />);
    expect(useAppStore.getState().preferences.ageBand).toBeNull();
  });
});
