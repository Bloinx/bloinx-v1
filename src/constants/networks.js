// eslint-disable-next-line import/prefer-default-export
import PolygonLogo from "../assets/BlackOnTransparent.svg";
import CeloLogo from "../assets/Celo_Symbol_Onyx.svg";
import { ALFAJORES_RPC_URL, CELO_MAINNET_RPC_URL } from "../utils/constants";

let networks = [];

if (process.env.NODE_ENV === "production") {
  networks = {
    137: {
      name: "polygon",
      chainId: 137,
      icon: PolygonLogo,
      currency: "Matic",
      rpcUrl: "https://polygon-rpc.com/",
      blockExplorer: "https://polygonscan.com/",
    },
    42220: {
      name: "celo",
      chainId: 42220,
      icon: CeloLogo,
      currency: "Celo",
      rpcUrl: CELO_MAINNET_RPC_URL,
      blockExplorer: "https://explorer.celo.org",
    },
  };
} else {
  networks = {
    80001: {
      name: "mumbai",
      chainId: 80001,
      icon: PolygonLogo,
      currency: "Matic",
      rpcUrl: "https://rpc-mumbai.maticvigil.com",
      faucet: "https://faucet.polygon.technology/",
      blockExplorer: "https://mumbai.polygonscan.com/",
    },
    44787: {
      name: "alfajores",
      chainId: 44787,
      icon: CeloLogo,
      currency: "Celo",
      rpcUrl: ALFAJORES_RPC_URL,
      blockExplorer: "https://alfajores-blockscout.celo-testnet.org/",
    },
  };
}

const NETWORKS = networks;

export default NETWORKS;
