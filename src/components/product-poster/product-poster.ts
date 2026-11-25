import './product-poster.scss';
import { createBadge } from '@/components/badge/badge';
import { getDiscount } from '@/components/price/price';
import { createPosterCopy } from '@/components/poster/poster';
import { getProductsByIds } from '@/logic/products';
import { buildHash } from '@/logic/route';
import starIcon from '@/assets/stars/star.svg';
import type { Product, ProductId } from '@/types/product';
import { el } from '@/utils/dom';

export type ProductPosterOptions = {
  title: string;
  subtitle: string;
  productIds: ProductId[];
  products: Product[];
  background?: 'primary' | 'header' | 'success' | 'surface';
  info?: 'discount' | 'rating';
  href: string;
};

const TILES_COUNT = 4;

const createTileInfo = (product: Product, info: 'discount' | 'rating'): HTMLElement => {
  const foot = el('div', 'product-poster__foot');
  if (info === 'rating') {
    const star = el('img', 'product-poster__star');
    star.src = starIcon;
    star.alt = '';
    foot.append(star, el('span', 'product-poster__rating', product.rating.toFixed(1)));
  } else if (product.oldPrice) {
    foot.append(
      createBadge({ variant: 'deal', label: `-${getDiscount(product.price, product.oldPrice)}%` }),
    );
  }
  return foot;
};

const createTile = (product: Product, info: 'discount' | 'rating'): HTMLElement => {
  const tile = el('a', 'product-poster__tile');
  tile.href = buildHash('product', { id: String(product.id) });
  tile.title = product.title;

  const image = el('img', 'product-poster__image');
  image.src = `${import.meta.env.BASE_URL}${product.image}`;
  image.alt = product.title;
  image.loading = 'lazy';

  tile.append(image, createTileInfo(product, info));
  return tile;
};

export const createProductPoster = (options: ProductPosterOptions): HTMLElement => {
  const {
    title,
    subtitle,
    productIds,
    products,
    background = 'primary',
    info = 'discount',
    href,
  } = options;

  const poster = el('div', `product-poster product-poster--${background}`);

  const link = el('a', 'product-poster__link');
  link.href = href;
  link.append(createPosterCopy(title, subtitle));

  const grid = el('div', 'product-poster__grid');
  for (const product of getProductsByIds(products, productIds).slice(0, TILES_COUNT)) {
    grid.append(createTile(product, info));
  }

  poster.append(link, grid);
  return poster;
};
