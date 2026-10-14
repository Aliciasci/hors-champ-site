import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import { EditorialNotice } from '@/components/content/EditorialNotice';
import { SourceList } from '@/components/content/SourceList';
import { Chip, ChipGroup, Segmented } from '@/components/ui/Chip';

import { TEST_SOURCE } from '../logic/fixtures';

function SegmentedHarness() {
  const [value, setValue] = useState<'all' | 'arts'>('all');
  return (
    <Segmented
      legend="Domaine"
      name="domaine"
      value={value}
      onChange={setValue}
      options={[
        { id: 'all', label: 'Tout' },
        { id: 'arts', label: 'Arts' },
      ]}
    />
  );
}

describe('Segmented', () => {
  it('est un groupe de boutons radio nommé, un seul coché', () => {
    render(<SegmentedHarness />);
    const group = screen.getByRole('group', { name: 'Domaine' });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Tout' })).toBeChecked();
    fireEvent.click(screen.getByRole('radio', { name: 'Arts' }));
    expect(screen.getByRole('radio', { name: 'Arts' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Tout' })).not.toBeChecked();
  });
});

describe('Chip', () => {
  it('repose sur une case à cocher native, avec un repère autre que la couleur', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <ChipGroup legend="Thèmes">
        <Chip name="t" value="a" checked={false} onChange={onChange}>
          Stéréotypes
        </Chip>
      </ChipGroup>,
    );
    const box = screen.getByRole('checkbox', { name: 'Stéréotypes' });
    fireEvent.click(box);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(container.querySelector('svg')).toBeNull();
    rerender(
      <ChipGroup legend="Thèmes">
        <Chip name="t" value="a" checked onChange={onChange}>
          Stéréotypes
        </Chip>
      </ChipGroup>,
    );
    expect(screen.getByRole('checkbox', { name: 'Stéréotypes' })).toBeChecked();
    expect(container.querySelector('svg')).not.toBeNull();
  });
});

describe('EditorialNotice', () => {
  it('affiche toujours le statut et replie son explication', () => {
    render(<EditorialNotice status="dev-example" reviewedAt={null} />);
    const notice = screen.getByTestId('editorial-notice');
    expect(notice.tagName).toBe('DETAILS');
    expect(notice).not.toHaveAttribute('open');
    expect(screen.getByText('Exemple de développement')).toBeVisible();
    fireEvent.click(screen.getByText('Exemple de développement'));
    expect(notice).toHaveAttribute('open');
  });

  it('date la relecture d’un contenu vérifié', () => {
    render(<EditorialNotice status="verified" reviewedAt="2026-10-12" />);
    expect(screen.getByText('Vérifié le 12 octobre 2026')).toBeInTheDocument();
  });
});

describe('SourceList', () => {
  it('affiche la note et ouvre la source dans un nouvel onglet sûr', () => {
    render(<SourceList sources={[TEST_SOURCE]} />);
    const link = screen.getByRole('link', { name: new RegExp(TEST_SOURCE.title) });
    expect(link).toHaveAttribute('href', TEST_SOURCE.url);
    expect(link.getAttribute('rel')).toContain('noopener');
    expect(screen.getByText(TEST_SOURCE.note)).toBeInTheDocument();
  });

  it('signale l’absence de source', () => {
    render(<SourceList sources={[]} />);
    expect(screen.getByTestId('source-list-empty')).toBeInTheDocument();
  });
});
