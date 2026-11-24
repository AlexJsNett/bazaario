import './product.scss';
import { createButton } from '@/components/button/button.ts';
import { createFavoriteButton } from '@/components/favorite-button/favorite-button.ts';
import { createPrice } from '@/components/price/price.ts';
import { createProductRow } from '@/components/product-row/product-row.ts';
import { createQuantityStepper } from '@/components/quantity-stepper/quantity-stepper.ts';
import { createRating } from '@/components/rating/rating.ts';
import { createReviewList } from '@/components/review-list/review-list.ts';
import { loadProducts } from '@/data/products.ts';
import { loadReviews } from '@/data/reviews.ts';
import { goTo } from '@/goTo.ts';
import { addToCart, decreaseInCart, getQuantity } from '@/logic/cart.ts';
import { toggleFavorite } from '@/logic/favorites.ts';
import { getProductById, getRecommendations } from '@/logic/products.ts';
import { getReviewItems, getReviews } from '@/logic/reviews.ts';
import { getUser, updateUser } from '@/store/user.ts';
import type { Product } from '@/types/product.ts';
import type { Review } from '@/types/reviews.ts';
import { el } from '@/utils/dom.ts';

const RECOMMENDATIONS_COUNT = 4;

const parseId = (query: URLSearchParams): number | undefined => {
  const id = Number(query.get('id'));
  return Number.isInteger(id) && id > 0 ? id : undefined;
};

const createNotFound = (): HTMLElement => {
  const box = el('section', 'product-page__not-found');
  box.append(
    el('h1', 'product-page__not-found-title', 'Product not found'),
    el('p', 'product-page__not-found-text', 'The link may be old or the product was removed.'),
    createButton({ label: 'Browse catalog', onClick: () => goTo('catalog') }),
  );
  return box;
};

export const render = (query: URLSearchParams): HTMLElement => {
  const page = el('main', 'product-page');
  const id = parseId(query);

  const draw = (products: Product[], reviews: Review[]): void => {
    const product = id === undefined ? undefined : getProductById(products, id);
    if (!product) {
      page.replaceChildren(createNotFound());
      return;
    }

    const { favorites, cart } = getUser();
    const quantity = getQuantity(cart, product.id);
    const change = (update: (user: ReturnType<typeof getUser>) => ReturnType<typeof getUser>) => {
      updateUser(update);
      draw(products, reviews);
    };
    const add = (target: Product): void =>
      change((user) => ({ ...user, cart: addToCart(user.cart, target.id) }));
    const decrease = (target: Product): void =>
      change((user) => ({ ...user, cart: decreaseInCart(user.cart, target.id) }));
    const favorite = (target: Product): void =>
      change((user) => ({ ...user, favorites: toggleFavorite(user.favorites, target.id) }));

    const image = el('img', 'product-page__image');
    image.src = `${import.meta.env.BASE_URL}${product.image}`;
    image.alt = product.title;

    let cartControl: HTMLElement;
    if (quantity > 0) {
      cartControl = createQuantityStepper({
        quantity,
        min: 0,
        onIncrease: () => add(product),
        onDecrease: () => decrease(product),
      });
      cartControl.classList.add('product-page__stepper');
    } else {
      cartControl = createButton({
        label: 'Add to cart',
        variant: 'primary',
        onClick: () => add(product),
      });
      cartControl.classList.add('product-page__button');
    }

    const actions = el('div', 'product-page__actions');
    actions.append(
      cartControl,
      createFavoriteButton({
        active: favorites.includes(product.id),
        onToggle: () => favorite(product),
      }),
    );

    const info = el('div', 'product-page__info');
    info.append(
      el('p', 'product-page__category', product.category),
      el('h1', 'product-page__title', product.title),
      createRating({ score: product.rating, reviewsCount: getReviews(reviews, product.id) }),
      createPrice({ price: product.price, oldPrice: product.oldPrice }),
      el('p', 'product-page__description', product.description),
      actions,
    );

    const recommended = getRecommendations(products, product, RECOMMENDATIONS_COUNT);
    const content = el('div', 'product-page__content');
    const top = el('div', 'product-page__top');
    top.append(image, info);
    content.append(
      top,
      createReviewList({
        reviews: getReviewItems(reviews, product.id),
        totalCount: getReviews(reviews, product.id),
      }),
    );
    if (recommended.length > 0) {
      content.append(
        createProductRow({
          title: 'You may also like',
          products: recommended,
          favorites,
          quantities: Object.fromEntries(
            recommended.map((item) => [item.id, getQuantity(cart, item.id)]),
          ),
          reviewsCount: Object.fromEntries(
            recommended.map((item) => [item.id, getReviews(reviews, item.id)]),
          ),
          onAddToCart: add,
          onDecrease: decrease,
          onToggleFavorite: favorite,
        }),
      );
    }
    page.replaceChildren(content);
  };

  page.append(el('p', 'product-page__message', 'Loading...'));
  // Reviews are optional: without them the page shows "No reviews yet".
  const loadingReviews = loadReviews().catch((error): Review[] => {
    console.error(error);
    return [];
  });
  Promise.all([loadProducts(), loadingReviews])
    .then(([products, reviews]) => {
      draw(products, reviews);
      // the user may come from the middle of a long page
      window.scrollTo(0, 0);
    })
    .catch((error) => {
      console.error(error);
      page.replaceChildren(
        el('p', 'product-page__message', 'Could not load the product, try again later'),
      );
    });

  return page;
};
