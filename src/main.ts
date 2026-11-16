import './styles/main.scss';
import { render as renderUiKit } from './pages/ui-kit/ui-kit';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  renderUiKit(app);
}
