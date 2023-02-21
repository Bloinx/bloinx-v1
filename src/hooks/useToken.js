import { useState, useEffect } from "react";
import { getTokenSymbol } from "../api/utils/getTokenData";

export default function useToken(networkId) {
  const [tokens, setTokens] = useState([]);

  const getTokenSymbolData = async () => {
    const data = await getTokenSymbol(networkId);
    return data;
  };

  useEffect(() => {
    getTokenSymbolData().then((data) => {
      console.log(data, "symbols");
      data.map((item) => setTokens((token) => [...token, item.symbol]));
    });
  }, [networkId]);

  return { tokens };
}
