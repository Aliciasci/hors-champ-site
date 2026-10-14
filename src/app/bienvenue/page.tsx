import { categories } from '@/data/categories';
import { Onboarding } from '@/features/onboarding/Onboarding';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Bienvenue',
  description:
    'Découvrir, suivre les liens, mettre à l’épreuve : l’approche de Hors-Champ en quatre étapes.',
  path: '/bienvenue',
  noindex: true,
});

export default function WelcomePage() {
  return <Onboarding categories={categories} />;
}
