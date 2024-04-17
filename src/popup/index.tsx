import '../global.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { proxyStore } from '../app/proxyStore';
import 'smarthr-ui/smarthr-ui.css';
import { createTheme, ThemeProvider } from 'smarthr-ui';
import Popup from './Popup';

const theme = createTheme();

proxyStore.ready().then(() => {
  createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <Provider store={proxyStore}>
        <ThemeProvider theme={theme}>
          <Popup />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
});
