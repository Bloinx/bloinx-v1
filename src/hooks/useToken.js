import { useState, useEffect } from "react";

export default function useToken(networkId) {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    switch (networkId) {
      case 42220:
        setTokens(["cUSD", "CELO", "cEUR"]);
        break;
      case 44787:
        setTokens(["cUSD", "CELO", "cEUR"]);
        break;
      case 137:
        setTokens(["MATIC", "USDC", "DAI", "USDT", "WBTC", "WETH"]);
        break;
      case 80001:
        setTokens(["MATIC", "USDC", "DAI", "USDT", "WBTC", "WETH"]);
        break;

      default:
        break;
    }
  }, [networkId]);

  return { tokens };
}
