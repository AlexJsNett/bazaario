import './favorites.scss';
import { getUser, updateUser } from '../../store/user.ts';
import { getProductById } from '../../logic/products.ts';
import { loadProducts } from '../../data/products.ts';
import type { Product } from '../../types/product.ts';
import { createProductCard } from '../../components/product-card/product-card.ts';
import { createButton } from '../../components/button/button';
import { el } from '../../utils/dom.ts';
import { toggleFavorite } from '../../logic/favorites.ts';
import { goTo } from '../../goTo';
import { addToCart } from '../../logic/cart.ts';
import { getReviews } from '../../logic/reviews.ts';
import { loadReviews } from '../../data/reviews.ts';
import type { Review } from '../../types/reviews.ts';

const createEmpty = (): HTMLElement => {
  const empty = el('section', 'favorites-page__empty');
  empty.append(
    el('h2', 'favorites-page__empty-title', 'No favorites yet'),
    el('p', 'favorites-page__empty-text', 'Tap the heart on a product and it will show up here.'),
    createButton({ label: 'Browse catalog', onClick: () => goTo('catalog') }),
  );
  return empty;
};

export const render = (): HTMLElement => {
  const page = el('main', 'favorites-page');
  let products: Product[] = [];
  let reviews: Review[] = [];

  const draw = () => {
    const { favorites } = getUser();
    const content = el('div', 'favorites-page__content');
    content.append(el('h1', 'favorites-page__title', 'Favorites'));

    const favoriteProducts = favorites
      .map((id) => getProductById(products, id))
      .filter((product): product is Product => Boolean(product));

    if (favoriteProducts.length === 0) {
      content.append(createEmpty());
      page.replaceChildren(content);
      return;
    }

    const grid = el('div', 'favorites-page__grid');

    for (const product of favoriteProducts) {
      grid.append(
        createProductCard({
          product,
          isFavorite: true,
          reviewsCount: getReviews(reviews, product.id),
          onAddToCart: () => {
            updateUser((user) => ({
              ...user,
              cart: addToCart(user.cart, product.id),
            }));
          },
          onToggleFavorite: () => {
            updateUser((user) => ({
              ...user,
              favorites: toggleFavorite(user.favorites, product.id),
            }));
            draw();
          },
        }),
      );
    }
    content.append(grid);
    page.replaceChildren(content);
  };

  Promise.all([loadProducts(), loadReviews().catch(() => [] as Review[])])
    .then(([loadedProducts, loadedReviews]) => {
      products = loadedProducts;
      reviews = loadedReviews;
      draw();
    })
    .catch((error) => {
      console.error(error);
      page.replaceChildren(
        el('p', 'favorites-page__empty-text', 'Could not load products, try again later'),
      );
    });
  return page;
};
