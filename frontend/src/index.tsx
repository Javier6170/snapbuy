// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './routes/AppRouter';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './app/store';

const root = ReactDOM.createRoot(
  document.getElementById('root')!
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
     <AppRouter />
    </Provider>
  </React.StrictMode>
);
