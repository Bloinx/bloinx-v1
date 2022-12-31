// eslint-disable-next-line import/prefer-default-export
let networks = [];

if (process.env.NODE_ENV === "production") {
  networks = [
    {
      name: "polygon",
      chainId: 137,
      icon: "",
      currency: "Matic",
      rpcUrl: "https://polygon-rpc.com/",
      blockExplorer: "https://polygonscan.com/",
    },
    {
      name: "celo",
      chainId: 42220,
      icon: "",
      currency: "Celo",
      rpcUrl: "https://forno.celo.org",
      blockExplorer: "https://explorer.celo.org",
    },
  ];
} else {
  networks = [
    {
      name: "mumbai",
      chainId: 80001,
      icon: "",
      currency: "Matic",
      rpcUrl: "https://rpc-mumbai.maticvigil.com",
      faucet: "https://faucet.polygon.technology/",
      blockExplorer: "https://mumbai.polygonscan.com/",
    },
    {
      name: "alfajores",
      chainId: 44787,
      icon: "",
      currency: "Celo",
      rpcUrl: "https://alfajores-forno.celo-testnet.org",
      blockExplorer: "https://alfajores-blockscout.celo-testnet.org/",
    },
  ];
}

const NETWORKS = networks;

export default NETWORKS;
