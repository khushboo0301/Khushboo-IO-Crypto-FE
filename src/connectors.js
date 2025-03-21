import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import apiConfig from "./service/config";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { createConfig, configureChains, mainnet } from "wagmi";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: `${apiConfig.INFURA_KEY}` }), publicProvider()]
);

const injected = new InjectedConnector();

const config = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: {
        projectId: `${apiConfig.WALLETCONNECT_KEY}`,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "middn",
        reloadOnDisconnect:false
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

const walletlink = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${apiConfig.INFURA_KEY}`,
  appName: "middn",
});

export const connectors = {
  injected: injected,
  coinbaseWallet: walletlink,
};

export const walletConnectConfig = config;
