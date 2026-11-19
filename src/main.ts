import './styles/main.scss';
import { createRouter } from './router.ts';
import { createDefaultLayout } from './components/layout/layout.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;

const routerEl = document.createElement('div');
routerEl.id = 'router';
const header = document.createElement('div');
header.innerText = 'header';
const footer = document.createElement('div');
footer.innerText = 'footer';

const layout = createDefaultLayout(header, routerEl, footer);
app.append(layout);

const destroyRouter = createRouter(routerEl);

// prevent events duplication on dev server
import.meta.hot?.dispose(destroyRouter);
