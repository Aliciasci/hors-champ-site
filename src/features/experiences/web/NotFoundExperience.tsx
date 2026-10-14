import { SearchX } from '@/components/icons';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';

/** Contrechamp absent du catalogue (lien incomplet, contenu retiré ou non publié). */
export function NotFoundExperience() {
  return (
    <Container width="reading">
      <EmptyState
        testId="experience-not-found"
        icon={SearchX}
        kicker="Introuvable"
        headingLevel={1}
        title="Ce contrechamp n’existe pas, ou plus"
        description="Le lien est peut-être incomplet, ou le contrechamp a été retiré. Le reste de vos données n’a pas bougé."
        actions={<ButtonLink href="/contrechamps/catalogue">Explorer les contrechamps</ButtonLink>}
      />
    </Container>
  );
}
