import './layout.scss';

export const createDefaultLayout = (
  header: HTMLElement,
  content: HTMLElement,
  footer: HTMLElement,
) => {
  const root = document.createElement('div');
  root.classList.add('layout');
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('layout__content');
  contentContainer.append(content);

  root.append(header, contentContainer, footer);
  return root;
};
