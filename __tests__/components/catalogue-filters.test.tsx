import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';

import { categories } from '@/data/categories';
import { localExperiences } from '@/data/experiences';
import { EMPTY_FILTERS, type ExperienceFilters } from '@/features/experiences/filterExperiences';
import { CatalogueView } from '@/features/experiences/web/Catalogue';
import type { Experience } from '@/types';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string | { src: string }; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === 'string' ? src : src.src} alt={alt} />
  ),
}));

const experiences = localExperiences as Experience[];

function Harness({ initial = EMPTY_FILTERS }: { initial?: ExperienceFilters }) {
  const [filters, setFilters] = useState(initial);
  return (
    <CatalogueView
      experiences={experiences}
      categories={categories}
      filters={filters}
      onChange={setFilters}
    />
  );
}

const count = () => screen.getByTestId('catalogue-count').textContent;

describe('Catalogue des contrechamps', () => {
  it('annonce le nombre de résultats dans une région live', () => {
    render(<Harness />);
    const status = screen.getByTestId('catalogue-count');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(count()).toBe(`${experiences.length} contrechamps`);
  });

  it('les filtres sont des cases à cocher dans des fieldsets avec légende', () => {
    render(<Harness />);
    const sidebar = screen.getByRole('complementary', { name: 'Filtres' });
    const themes = within(sidebar).getByRole('group', { name: 'Thèmes' });
    expect(within(themes).getAllByRole('checkbox')).toHaveLength(categories.length);
    expect(within(sidebar).getByRole('group', { name: 'Durée' })).toBeInTheDocument();
  });

  it('« ou » dans un groupe, « et » entre groupes, puis réinitialisation', () => {
    render(<Harness />);
    const [first, second] = experiences;
    const sidebar = screen.getByRole('complementary', { name: 'Filtres' });
    fireEvent.click(within(sidebar).getByTestId(`filtre-theme-${first!.categoryId}`));
    const one = experiences.filter((e) => e.categoryId === first!.categoryId).length;
    expect(count()).toMatch(new RegExp(`^${one} `));
    fireEvent.click(within(sidebar).getByTestId(`filtre-theme-${second!.categoryId}`));
    const both = experiences.filter((e) =>
      [first!.categoryId, second!.categoryId].includes(e.categoryId),
    ).length;
    expect(count()).toMatch(new RegExp(`^${both} `));
    // Une durée qu'aucun ne remplit : « et » entre groupes → aucun résultat.
    const longOnes = experiences.filter(
      (e) =>
        e.estimatedMinutes >= 8 && [first!.categoryId, second!.categoryId].includes(e.categoryId),
    ).length;
    fireEvent.click(within(sidebar).getByTestId('filtre-duree-long'));
    expect(count()).toMatch(new RegExp(`^${longOnes} `));
    fireEvent.click(screen.getAllByRole('button', { name: /réinitialiser/i })[0]!);
    expect(count()).toBe(`${experiences.length} contrechamps`);
  });

  it('recherche insensible aux accents et à la casse', () => {
    render(<Harness />);
    const target = experiences.find((e) => /[éèàç]/.test(e.title))!;
    const word = target.title.split(' ').find((w) => /[éèàç]/.test(w))!;
    const plain = word.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
    fireEvent.change(screen.getByTestId('catalogue-search'), { target: { value: plain } });
    expect(screen.getByTestId(`catalogue-card-${target.id}`)).toBeInTheDocument();
  });

  it('état « aucun résultat » avec une action de réinitialisation', () => {
    render(<Harness />);
    fireEvent.change(screen.getByTestId('catalogue-search'), {
      target: { value: 'zzzintrouvable' },
    });
    expect(screen.getByTestId('catalogue-no-results')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tout réinitialiser' }));
    expect(count()).toBe(`${experiences.length} contrechamps`);
  });

  it('le raccourci « / » place le focus dans la recherche', () => {
    render(<Harness />);
    fireEvent.keyDown(document.body, { key: '/' });
    expect(screen.getByTestId('catalogue-search')).toHaveFocus();
  });
});
