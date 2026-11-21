import './cart.scss';
import type { Cart, PromoCode } from '../../types/cart';
import type { Product } from '../../types/product';
import { el } from '../../utils/dom';
import { createButton } from '../../components/button/button';
import { createCart } from '../../components/cart/cart';
import { createCartSummary } from '../../components/cart-summary/cart-summary';
import {
  calculateTotal,
  changeQuantity,
  findPromoCode,
  getCartCount,
  removeFromCart,
} from '../../logic/cart';
import { goTo } from '../../goTo';
import { getPromo } from '../../data/promo.ts';
import { loadProducts } from '../../data/products.ts';
import { loadReviews } from '../../data/reviews.ts';
import { getReviews } from '../../logic/reviews.ts';
import type { Review } from '../../types/reviews.ts';
import { getUser, updateUser } from '../../store/user.ts';

type PageState = {
  products: Product[];
  reviews: Review[];
  promoInput: string;
  appliedCode?: string;
  promoError?: string;
};

const createEmpty = (): HTMLElement => {
  const empty = el('section', 'cart-page__empty');
  empty.append(
    el('h2', 'cart-page__empty-title', 'Your cart is empty'),
    el('p', 'cart-page__empty-text', 'Add something you like and it will show up here.'),
    createButton({ label: 'Browse catalog', onClick: () => goTo('catalog') }),
  );
  return empty;
};

export const render = (): HTMLElement => {
  const page = el('main', 'cart-page');
  let state: PageState = { products: [], reviews: [], promoInput: '' };

  const draw = (): void => {
    const { products, reviews, appliedCode, promoError, promoInput } = state;
    // Read fresh on every draw, the store is the only owner of the cart.
    const { cart } = getUser();
    const content = el('div', 'cart-page__content');
    content.append(el('h1', 'cart-page__title', 'Cart'));

    if (cart.products.length === 0) {
      content.append(createEmpty());
      page.replaceChildren(content);
      return;
    }

    const promos = [getPromo(state.promoInput)].filter(Boolean) as PromoCode[];
    const price = calculateTotal(products, promos, cart, appliedCode);
    const layout = el('div', 'cart-page__layout');
    const summary = createCartSummary({
      itemsCount: getCartCount(cart),
      subtotal: price.subtotal,
      discount: price.discount,
      total: price.total,
      appliedCode,
      promoError,
      promoValue: promoInput,
      onPromoInput: (value) => {
        state = { ...state, promoInput: value };
      },
      onApplyPromo: applyPromo,
    });
    summary.classList.add('cart-page__summary');
    const orderButton = createButton({ variant: 'primary', label: 'Confirm order' });
    orderButton.classList.add('cart-page__confirm-button');
    orderButton.addEventListener('click', () => alert('Bazaario is not a real store ))'));
    const sideContainer = el('div');
    sideContainer.append(summary, orderButton);
    layout.append(
      createCart({
        products,
        cart,
        reviewsCount: Object.fromEntries(
          cart.products.map((item) => [item.productId, getReviews(reviews, item.productId)]),
        ),
        onIncrease: (p) => changeCart((c) => changeQuantity(c, p.id, 1)),
        onDecrease: (p) => changeCart((c) => changeQuantity(c, p.id, -1)),
        onRemove: (p) => changeCart((c) => removeFromCart(c, p.id)),
      }),
      sideContainer,
    );
    content.append(layout);
    page.replaceChildren(content);
  };

  const changeCart = (change: (cart: Cart) => Cart): void => {
    updateUser((user) => ({ ...user, cart: change(user.cart) }));
    draw();
  };

  const update = (patch: Partial<PageState>): void => {
    state = { ...state, ...patch };
    draw();
  };

  const applyPromo = (): void => {
    const promos = [getPromo(state.promoInput)].filter(Boolean) as PromoCode[];
    const found = findPromoCode(promos, state.promoInput);
    if (found) {
      update({ appliedCode: found.code, promoError: undefined });
    } else {
      update({ appliedCode: undefined, promoError: 'Promo code not found' });
    }
  };

  // Reviews are optional: if they fail to load, the cart still works with 0 reviews.
  const loadingReviews = loadReviews().catch((error): Review[] => {
    console.error(error);
    return [];
  });

  Promise.all([loadProducts(), loadingReviews])
    .then(([products, reviews]) => update({ products, reviews }))
    .catch((error) => {
      console.error(error);
      page.replaceChildren(
        el('p', 'cart-page__empty-text', 'Could not load products, try again later'),
      );
    });
  return page;
};
