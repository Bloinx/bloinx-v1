import { useState, useEffect } from "react";
import { getTokenSymbol } from "../api/utils/getTokenData";

export default function useToken(networkId) {
  const [tokens, setTokens] = useState([]);

  const getTokenSymbolData = async (network) => {
    const data = await getTokenSymbol(network);
    return data;
  };

  useEffect(() => {
    if (typeof networkId === "number") {
      getTokenSymbolData(networkId).then((data) => {
        data.map((item) => setTokens((token) => [...token, item.symbol]));
      });
    }
  }, [networkId]);

  return { tokens };
}
