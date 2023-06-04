import * as ReactDOMClient from 'react-dom/client';
import '../assets/application.scss';
import init from './init.jsx';

const renderApp = () => {
  const vDom = init(); // инициализация приложения

  const container = document.getElementById('chat');
  const root = ReactDOMClient.createRoot(container);
  root.render(vDom); // рендерим результат инициализации в элемент с id 'chat'
};

renderApp();
