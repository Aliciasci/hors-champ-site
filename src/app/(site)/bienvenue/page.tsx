import { categories } from '@/data/categories';
import { Onboarding } from '@/features/onboarding/Onboarding';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Bienvenue',
  description: 'Ce que Hors-Champ raconte, et comment s’y retrouver, en deux minutes.',
  path: '/bienvenue',
  noindex: true,
});

export default function WelcomePage() {
  return <Onboarding categories={categories} />;
}
