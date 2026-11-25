import '@/pages/home/home.scss';
import blackFridayImage from '@/assets/posters/black-friday.webp';
import catPartyImage from '@/assets/posters/cat-party.webp';
import getFitImage from '@/assets/posters/get-fit.webp';
import soundCheckImage from '@/assets/posters/sound-check.webp';
import { createCarousel } from '@/components/carousel/carousel.ts';
import { createPoster } from '@/components/poster/poster.ts';
import { createProductPoster } from '@/components/product-poster/product-poster.ts';
import { loadProducts } from '@/data/products.ts';
import { buildHash } from '@/logic/route.ts';
import type { Product } from '@/types/product.ts';
import { el } from '@/utils/dom.ts';

const createPosters = (products: Product[]): HTMLElement[] => [
  createPoster({
    eyebrow: 'Black Friday deals on now',
    title: 'Black Friday is here',
    subtitle: 'Drops on tech, sound and sneakers.',
    image: blackFridayImage,
    background: '#1b2433',
    tone: 'light',
    badge: { variant: 'deal', label: 'Up to 40% off' },
    href: buildHash('catalog'),
  }),
  createProductPoster({
    title: "Don't miss these deals",
    subtitle: 'New prices every morning.',
    products,
    productIds: [2, 13, 23, 28],
    background: 'primary',
    href: buildHash('catalog'),
  }),
  createPoster({
    eyebrow: 'Get fit at home',
    title: 'Your gym is at home',
    subtitle: 'Weights, mats and bands. No gym card needed.',
    image: getFitImage,
    background: '#f3f5f7',
    badge: { variant: 'neutral', label: 'Ends Sunday' },
    href: buildHash('catalog', { category: 'Sport equipment' }),
  }),
  createProductPoster({
    title: 'Top rated, no debate',
    subtitle: 'The best reviewed picks.',
    products,
    productIds: [5, 7, 12, 22],
    background: 'header',
    info: 'rating',
    href: buildHash('catalog'),
  }),
  createPoster({
    eyebrow: 'Cat party',
    title: 'Your cat wants these',
    subtitle: 'Feather wands, laser dots and felt mice.',
    image: catPartyImage,
    background: '#ff9900',
    badge: { variant: 'save', label: 'Save 25%' },
    href: buildHash('catalog', { query: 'cat' }),
  }),
  createPoster({
    eyebrow: 'Sound check',
    title: 'Hear what you missed',
    subtitle: 'Headphones, speakers and microphones.',
    image: soundCheckImage,
    background: '#f6e9dc',
    badge: { variant: 'highlight', label: "Bazaario's Choice" },
    href: buildHash('catalog', { query: 'headphones' }),
  }),
  createProductPoster({
    title: 'Start your channel today',
    subtitle: 'Mics for streams and podcasts.',
    products,
    productIds: [6, 7, 8, 9],
    background: 'surface',
    href: buildHash('catalog', { query: 'microphone' }),
  }),
];

export const render = (): HTMLElement => {
  const page = el('main', 'home');
  page.append(el('p', 'home__message', 'Loading...'));

  loadProducts()
    .then((products) => {
      const carousel = createCarousel({ childs: createPosters(products) });
      carousel.classList.add('home__posters');
      page.replaceChildren(carousel);
    })
    .catch((error) => {
      // error handler like in product page
      console.error(error);
      page.replaceChildren(el('p', 'home__message', 'Could not load the page, try again later'));
    });

  return page;
};
