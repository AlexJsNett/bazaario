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
import { createButton } from '@/components/button/button.ts';
import { goTo } from '@/goTo.ts';
import { type BadgeOptions, createBadge } from '@/components/badge/badge.ts';

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
    productIds: [5, 7, 12, 27],
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
    productIds: [6, 7, 10, 9],
    background: 'surface',
    href: buildHash('catalog', { query: 'microphone' }),
  }),
];

type PartnerItem = {
  title: string;
  description: string;
  image: string;
};

const partnersData: PartnerItem[] = [
  {
    title: 'Cat Express',
    description: 'Express delivery, nationwide',
    image: 'images/partners/logo-cat-express.webp',
  },
  {
    title: 'Whisker Post',
    description: 'Letters and small parcels',
    image: 'images/partners/logo-whisker-post.webp',
  },
  {
    title: 'Purrcel',
    description: 'Parcel lockers',
    image: 'images/partners/logo-purrcel.webp',
  },
  {
    title: 'Paw Dispatch',
    description: 'Same-day city courier',
    image: 'images/partners/logo-paw-dispatch.webp',
  },
  {
    title: 'Nine Lives Cargo',
    description: 'Heavy items delivery',
    image: 'images/partners/logo-nine-lives.webp',
  },
];

const createPartnersSection = (): HTMLElement => {
  const partners = el('section', 'home__section partners');
  const items = el('ul', 'partners__list');

  partnersData.forEach(({ title, description, image }) => {
    const item = el('li', 'partners__item');

    const logo = el('img', 'partners__logo');
    logo.src = `${import.meta.env.BASE_URL}${image}`;
    logo.alt = '';
    logo.loading = 'lazy';

    item.append(
      logo,
      el('h3', 'partners__name', title),
      el('p', 'partners__description', description),
    );
    items.append(item);
  });

  partners.append(el('h2', 'partners__title', 'Our partners'), items);
  return partners;
};

const createAboutUsSection = (): HTMLElement => {
  const section = el('section', 'home__section');
  const container = el('div', 'home-about');
  const image = el('img', 'home-about__image');
  image.src = `${import.meta.env.BASE_URL}images/about/warehouse.webp`;
  image.alt = 'A cat sitting in an aisle of a large warehouse';
  image.loading = 'lazy';

  const content = el('div', 'home-about__content');
  const button = createButton({
    label: 'Learn more about us',
    variant: 'outline',
    onClick: () => goTo('about'),
  });
  button.classList.add('home-about__button');

  content.append(
    el('h2', 'home-about__title', 'What is Bazaario?'),
    el(
      'p',
      'home-about__text',
      'Think of a big marketplace like Amazon, but simple and friendly. You look through the products, find what you like, save it and put it in the cart. No sign up, no waiting.',
    ),
    button,
    el(
      'p',
      'home-about__note',
      'Bazaario is a demo store. Nothing is really for sale: there are no payments and nothing is shipped. Your favorites and your cart stay in your own browser, so nobody else can see them.',
    ),
  );

  container.append(image, content);
  section.append(container);
  return section;
};

type DeliveryOption = {
  title: string;
  deliveryPeriod: string;
  badge: BadgeOptions;
};

const deliveryOptions: DeliveryOption[] = [
  {
    title: 'Standard',
    deliveryPeriod: '2 - 4 days',
    badge: { variant: 'save', label: 'Free over 50 EUR' },
  },
  {
    title: 'Express',
    deliveryPeriod: 'Next day',
    badge: { variant: 'neutral', label: 'Order before 6 pm' },
  },
  {
    title: 'Pickup point',
    deliveryPeriod: 'In 2 days',
    badge: { variant: 'neutral', label: 'Lockers near you' },
  },
];

const createDeliverySection = (): HTMLElement => {
  const section = el('section', 'home__section delivery');

  const options = el('ul', 'delivery__list');
  deliveryOptions.forEach(({ title, deliveryPeriod, badge }) => {
    const item = el('li', 'delivery__item');
    item.append(
      el('h3', 'delivery__name', title),
      el('p', 'delivery__period', deliveryPeriod),
      createBadge(badge),
    );
    options.append(item);
  });

  section.append(
    el('h2', 'delivery__title', 'Delivery that lands on its feet'),
    el('p', 'delivery__text', 'Pick the speed that suits you. We handle the rest.'),
    options,
  );
  return section;
};

export const render = (): HTMLElement => {
  const page = el('main', 'home');
  const carouselSection = el('section');
  carouselSection.classList.add('home__carousel');
  carouselSection.append(el('p', 'home__message', 'Loading...'));

  const partnersSection = createPartnersSection();
  const aboutUsSection = createAboutUsSection();
  const deliverySection = createDeliverySection();

  page.append(carouselSection, aboutUsSection, deliverySection, partnersSection);

  loadProducts()
    .then((products) => {
      const carousel = createCarousel({ childs: createPosters(products) });
      carousel.classList.add('home__posters');
      carouselSection.replaceChildren(carousel);
    })
    .catch((error) => {
      // error handler like in product page
      console.error(error);
      carouselSection.replaceChildren(
        el('p', 'home__message', 'Could not load the page, try again later'),
      );
    });

  return page;
};
