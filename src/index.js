import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import React from "react";
import ReactDOM from "react-dom/client";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./store";
import "./style.scss";
import { WagmiConfig } from "wagmi";
import { walletConnectConfig } from "./connectors";

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 8000; // frequency provider is polling
  return library;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Web3ReactProvider getLibrary={getLibrary}>
          <WagmiConfig config={walletConnectConfig}>
            <App />
          </WagmiConfig>
        </Web3ReactProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
