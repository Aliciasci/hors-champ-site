import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import { toggleOption } from '@/features/experiences/answerLogic';
import { OptionCard } from '@/features/experiences/web/OptionCard';
import type { AnswerOption, QuestionMode } from '@/types';

const OPTIONS: AnswerOption[] = [
  { id: 'a', label: 'Première lecture', assessment: 'solid', feedback: 'Retour A' },
  { id: 'b', label: 'Deuxième lecture', assessment: 'weak', feedback: 'Retour B' },
];

function Group({ mode, revealed = false }: { mode: QuestionMode; revealed?: boolean }) {
  const [selection, setSelection] = useState<string[]>(revealed ? ['a'] : []);
  return (
    <fieldset>
      <legend>Question</legend>
      {OPTIONS.map((option, index) => (
        <OptionCard
          key={option.id}
          option={option}
          mode={mode}
          name="q"
          marker={String.fromCharCode(65 + index)}
          selected={selection.includes(option.id)}
          revealed={revealed}
          onToggle={
            revealed ? undefined : () => setSelection((s) => toggleOption(mode, s, option.id))
          }
        />
      ))}
    </fieldset>
  );
}

describe('OptionCard', () => {
  it('choix unique : des boutons radio natifs, un seul coché à la fois', () => {
    render(<Group mode="single" />);
    const a = screen.getByRole('radio', { name: /Première lecture/ });
    const b = screen.getByRole('radio', { name: /Deuxième lecture/ });
    fireEvent.click(a);
    expect(a).toBeChecked();
    fireEvent.click(b);
    expect(b).toBeChecked();
    expect(a).not.toBeChecked();
  });

  it('choix multiple : des cases à cocher, la carte entière est cliquable', () => {
    render(<Group mode="multiple" />);
    fireEvent.click(screen.getByText('Première lecture'));
    fireEvent.click(screen.getByText('Deuxième lecture'));
    expect(screen.getByRole('checkbox', { name: /Première lecture/ })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /Deuxième lecture/ })).toBeChecked();
    fireEvent.click(screen.getByText('Première lecture'));
    expect(screen.getByRole('checkbox', { name: /Première lecture/ })).not.toBeChecked();
  });

  it('une fois la réponse validée : contrôles figés, qualification en texte (pas seulement en couleur)', () => {
    render(<Group mode="single" revealed />);
    const a = screen.getByRole('radio', { name: /Première lecture/ });
    expect(a).toBeChecked();
    expect(a).toBeDisabled();
    expect(screen.getByText('Raisonnement solide')).toBeInTheDocument();
    expect(a).toHaveAccessibleDescription(/Retour A/);
  });
});
