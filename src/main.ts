import './styles/main.scss';
import { createRouter } from './router.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;

const routerEl = document.createElement('div');
routerEl.id = 'router';
app.append(routerEl);

const destroyRouter = createRouter(routerEl);

// prevent events duplication on dev server
import.meta.hot?.dispose(destroyRouter);
