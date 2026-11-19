import { type RouteName } from '../../router.ts';
import { goTo } from '../../goTo.ts';

export const render = () => {
  const rootEl = document.createElement('div');
  rootEl.textContent = 'this is about page';
  ['ui-kit', 'main', 'about', 'cart', 'catalog', 'favorites'].forEach((name) => {
    const goToUiKitButton = document.createElement('button');
    goToUiKitButton.innerText = `go to ${name}`;
    goToUiKitButton.addEventListener('click', () => goTo(name as RouteName));
    rootEl.append(goToUiKitButton);
  });

  return rootEl;
};
