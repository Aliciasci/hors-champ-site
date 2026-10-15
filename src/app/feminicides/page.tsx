import { FeminicidesStory } from '@/features/feminicides/FeminicidesStory';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Féminicides : derrière chaque chiffre, une histoire',
  description:
    'Un récit en cinq actes sur les féminicides : leur ampleur, chiffres sourcés à l’appui, ce qui les précède, ce qui protège, et où trouver de l’aide en France.',
  path: '/feminicides',
});

export default function FeminicidesPage() {
  return <FeminicidesStory />;
}
