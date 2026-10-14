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
        title="Ce chemin ne mène nulle part"
        description="Le lien suivi ne correspond à aucune page du site : il est peut-être incomplet, ou la fiche a été retirée."
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
