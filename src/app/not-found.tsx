import { MapPinOff } from '@/components/icons';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';

// Next ajoute lui-même `noindex` à la page introuvable.
export const metadata = { title: 'Page introuvable' };

export default function NotFound() {
  return (
    <Container width="reading">
      <EmptyState
        testId="not-found"
        icon={MapPinOff}
        kicker="Page introuvable"
        title="Cette page n’existe pas"
        description="Le lien est peut-être incomplet, ou la fiche a été retirée. Repartez de la une, il y a de quoi lire."
        headingLevel={1}
        actions={
          <>
            <ButtonLink href="/">Retour à l’accueil</ButtonLink>
            <ButtonLink href="/collection" variant="secondary">
              Toute la collection
            </ButtonLink>
          </>
        }
      />
    </Container>
  );
}
