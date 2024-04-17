import 'webextension-polyfill';
import 'construct-style-sheets-polyfill';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { twind, config, cssom, observe } from './twind';
import { proxyStore } from '../app/proxyStore';
import Content from './Content';

proxyStore.ready().then(() => {
  const contentRoot = document.createElement('div');
  contentRoot.id = 'my-extension-root';
  contentRoot.style.display = 'contents';
  document.body.append(contentRoot);

  const shadowRoot = contentRoot.attachShadow({ mode: 'open' });
  const sheet = cssom(new CSSStyleSheet());

  shadowRoot.adoptedStyleSheets = [sheet.target];

  const tw = twind(config, sheet);
  observe(tw, shadowRoot);

  const shadowWrapper = document.createElement('div');
  shadowWrapper.id = 'root';
  shadowWrapper.style.display = 'contents';
  shadowRoot.appendChild(shadowWrapper);

  createRoot(shadowWrapper).render(
    <React.StrictMode>
      <Provider store={proxyStore}>
        <Content />
      </Provider>
    </React.StrictMode>
  );
});
