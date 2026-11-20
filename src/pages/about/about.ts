import './about.scss';
import { createButton } from '../../components/button/button.ts';
import { goTo } from '../../goTo.ts';
import { el } from '../../utils/dom.ts';

type Feature = { title: string; text: string };
type Developer = { login: string; role: string };

const FEATURES: Feature[] = [
  {
    title: 'Browse the catalog',
    text: 'Every product has a photo, a price, a rating and a short description. Old prices are crossed out and the discount is shown, so a good deal is easy to see.',
  },
  {
    title: 'Search and filters',
    text: 'Type a word, pick a category, set a price range or a minimum rating. You can sort by price or by rating. The filters live in the address, so a link to a search can be shared.',
  },
  {
    title: 'Favorites',
    text: 'Press the heart on a product to save it for later. The counter in the header always shows how many products you saved.',
  },
  {
    title: 'Cart',
    text: 'Add products to the cart, change the quantity or remove them. The cart shows the total price of everything you chose.',
  },
];

const DEVELOPERS: Developer[] = [
  {
    login: 'AlexJsNett',
    role: 'project setup, design system, header and footer, catalog logic, favorites, About and Catalog pages',
  },
  {
    login: 'IvanovVlad',
    role: 'router, product data, Badge, Rating, Price and ProductCard, cart logic, Home, Cart and Favorites pages',
  },
];

const createHero = (): HTMLElement => {
  const hero = el('section', 'about__hero');
  hero.append(
    el('h1', 'about__title', 'Welcome to Bazaario'),
    el(
      'p',
      'about__lead',
      'Bazaario is an online marketplace with everything in one place: headphones and tablets, sneakers and sports gear, even toys for your cat.',
    ),
    createButton({ label: 'Open the catalog', variant: 'primary', onClick: () => goTo('catalog') }),
  );
  return hero;
};

const createIntro = (): HTMLElement => {
  const section = el('section', 'about__section');
  section.append(
    el('h2', 'about__heading', 'What is Bazaario?'),
    el(
      'p',
      'about__text',
      'Think of a big marketplace like Amazon, but simple and friendly. You look through the products, find what you like, save it and put it in the cart. No sign up, no waiting.',
    ),
    el(
      'p',
      'about__text',
      'Bazaario is a demo store. Nothing is really for sale: there are no payments and nothing is shipped. Your favorites and your cart stay in your own browser, so nobody else can see them.',
    ),
  );
  return section;
};

const createFeatures = (): HTMLElement => {
  const section = el('section', 'about__section');
  section.append(el('h2', 'about__heading', 'What you can do here'));
  const grid = el('div', 'about__features');
  for (const feature of FEATURES) {
    const card = el('article', 'about__card');
    card.append(el('h3', 'about__card-title', feature.title), el('p', 'about__text', feature.text));
    grid.append(card);
  }
  section.append(grid);
  return section;
};

const createTeamNote = (): HTMLElement => {
  const note = el('footer', 'about__team');
  note.append(
    el(
      'p',
      'about__team-text',
      'Bazaario is a team project of two students at RS School. Built with TypeScript, Vite and SCSS.',
    ),
  );
  const list = el('ul', 'about__developers');
  for (const developer of DEVELOPERS) {
    const item = el('li', 'about__developer');
    const link = el('a', 'about__developer-link', developer.login);
    link.href = `https://github.com/${developer.login}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    item.append(link, ` ${developer.role}.`);
    list.append(item);
  }
  note.append(list);
  return note;
};

export const render = (): HTMLElement => {
  const page = el('main', 'about');
  page.append(createHero(), createIntro(), createFeatures(), createTeamNote());
  return page;
};
