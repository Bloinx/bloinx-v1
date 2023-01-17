import { useState, useEffect } from "react";

export default function useToken(networkId) {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    if (networkId === "Celo") {
      setTokens(["cUSD", "CELO", "cEUR"]);
    } else {
      setTokens(["MATIC", "USDC", "DAI", "USDT", "WBTC", "WETH"]);
    }
  }, [networkId]);

  return { tokens };
}
