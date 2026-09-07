import React from 'react';
import ReactDOM from 'react-dom/client';
import '@solana/wallet-adapter-react-ui/styles.css';
import './styles.css';
import { SolanaProvider } from './components/SolanaProvider.jsx';
import { App } from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SolanaProvider>
      <App />
    </SolanaProvider>
  </React.StrictMode>,
);
