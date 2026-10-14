import { getCatalog } from '@/content/catalog';
import { slimExperience } from '@/content/slim';
import { ProfileView } from '@/features/profile/ProfileView';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Profil',
  description: 'Votre exploration, l’apparence du site, vos préférences et vos données locales.',
  path: '/profil',
  noindex: true,
});

export default function ProfilePage() {
  const { culture, experiences, categories, youthItems } = getCatalog();
  return (
    <ProfileView
      cultureIds={culture.map((e) => e.id)}
      youthIds={youthItems.map((i) => i.id)}
      experiences={experiences.map(slimExperience)}
      categories={categories}
    />
  );
}
