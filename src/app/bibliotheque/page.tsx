import { Suspense } from 'react';

import { getCatalog } from '@/content/catalog';
import { slimEntity, slimExperience, slimYouth } from '@/content/slim';
import { LibraryFallback, LibraryView } from '@/features/library/LibraryView';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Bibliothèque',
  description: 'Les fiches et les contrechamps que vous avez mis de côté.',
  path: '/bibliotheque',
  noindex: true,
});

export default function LibraryPage() {
  const { culture, experiences, categories, youthItems } = getCatalog();
  const props = {
    entities: culture.map(slimEntity),
    experiences: experiences.map(slimExperience),
    categories,
    youth: youthItems.map(slimYouth),
  };
  return (
    <Suspense fallback={<LibraryFallback {...props} />}>
      <LibraryView {...props} />
    </Suspense>
  );
}
