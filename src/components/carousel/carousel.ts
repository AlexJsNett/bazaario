import '@/components/carousel/carousel.scss';
import { el } from '@/utils/dom.ts';

export type CarouselOptions = {
  childs: HTMLElement[];
};

export const createCarousel = ({ childs }: CarouselOptions) => {
  const carousel = el('div', 'carousel');

  const leftButton = el(
    'button',
    'carousel__scroll-button carousel__scroll-button--left scroll-button scroll-button--left',
  );
  leftButton.type = 'button';
  leftButton.ariaLabel = 'Scroll left';

  const rightButton = el(
    'button',
    'carousel__scroll-button carousel__scroll-button--right scroll-button scroll-button--right',
  );
  rightButton.type = 'button';
  rightButton.ariaLabel = 'Scroll right';

  const itemsContainer = el('ul', 'carousel__items');

  const items = childs.map((c) => {
    const item = el('li', 'carousel__item');
    item.appendChild(c);
    return item;
  });

  const toggleButtonsVisibility = () => {
    const hideClass = 'scroll-button--hidden';
    leftButton.classList.toggle(hideClass, itemsContainer.scrollLeft === 0);
    rightButton.classList.toggle(
      hideClass,
      itemsContainer.scrollLeft >= itemsContainer.scrollWidth - itemsContainer.clientWidth - 10,
    );
  };

  const scrollItems = (direction: 'left' | 'right') => {
    if (!items.length) return;
    const maximumScroll = itemsContainer.scrollWidth - itemsContainer.clientWidth;
    let target =
      itemsContainer.scrollLeft + items[0].clientWidth * 0.8 * (direction === 'left' ? -1 : 1);
    target = Math.max(0, Math.min(target, maximumScroll));

    itemsContainer.scrollTo({
      left: target,
      behavior: 'smooth',
    });
  };

  rightButton.addEventListener('click', () => scrollItems('right'));
  leftButton.addEventListener('click', () => scrollItems('left'));

  itemsContainer.append(...items);

  carousel.append(leftButton, rightButton, itemsContainer);

  const observer = new ResizeObserver(toggleButtonsVisibility);
  observer.observe(itemsContainer);
  items.forEach((item) => observer.observe(item));
  itemsContainer.addEventListener('scroll', toggleButtonsVisibility, { passive: true });

  return carousel;
};
