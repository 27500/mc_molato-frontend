import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CartProvider } from './context/CartContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx'; // 1. Importe le provider des favoris

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <FavoritesProvider> {/* 2. Enveloppe ton App ici */}
        <App />
      </FavoritesProvider>
    </CartProvider>
  </React.StrictMode>,
);