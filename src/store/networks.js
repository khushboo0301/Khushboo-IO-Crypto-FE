export const networks = {
  ETH: {
    chainId: "0x1", // Ethereum Mainnet
    chainName: "Ethereum Mainnet",
    rpcUrls: ["https://mainnet.infura.io/v3/b16f8eb83d5749d18959c29c249e51f1"], // Replace with your Infura project ID
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://etherscan.io"],
    usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
  BNB: {
    chainId: "0x38", // Binance Smart Chain Mainnet
    chainName: "Binance Smart Chain Mainnet",
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    blockExplorerUrls: ["https://bscscan.com"],
    usdtAddress: '0x55d398326f99059fF775485246999027B3197955',
  },
  FTM: {
    chainId: "0xfa", // Fantom Mainnet
    chainName: "Fantom Opera",
    rpcUrls: ["https://rpc.ftm.tools/", "https://rpcapi.fantom.network"],
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
    },
    blockExplorerUrls: ["https://ftmscan.com/"],
    usdtAddress: '0x049d68029688eAbF473097a2fC38ef61633A3C7A',
  },
  MATIC: {
    chainId: "0x89", // Polygon Mainnet (137 in decimal)
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://polygon-rpc.com"],
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://polygonscan.com"],
    usdtAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  }
};
