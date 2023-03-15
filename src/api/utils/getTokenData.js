import supabase from "../../supabase";

export const getTokenData = async (chainId) => {
  //   const userData = localStorage.getItem("user_address");
  //   const { chainId } = userData ? JSON.parse(userData) : null;

  const { data } = await supabase
    .from("tokens")
    .select()
    .eq("chainId", chainId);
  return data[0];
};

export const getTokenId = async (chainId) => {
  const { data } = await supabase
    .from("tokens")
    .select("id")
    .eq("chainId", chainId);
  return data[0].id;
};

export const getTokenSymbol = async (chainId) => {
  const { data } = await supabase
    .from("tokens")
    .select("symbol")
    .eq("chainId", chainId);
  return data;
};

export const getTokenSymbolByRound = async (tokenId) => {
  const { data } = await supabase
    .from("tokens")
    .select("symbol")
    .eq("id", tokenId);
  return data[0].symbol;
};

export const getTokenDecimals = async (tokenId) => {
  const { data } = await supabase
    .from("tokens")
    .select("decimals")
    .eq("id", tokenId);

  return data[0].decimals;
};

export const getTokenAddress = async (tokenSelected) => {
  const { data } = await supabase
    .from("tokens")
    .select("address")
    .eq("symbol", tokenSelected);
  return data[0].address;
};

export const getTokenIdP = async (tokenSelected) => {
  const { data } = await supabase
    .from("tokens")
    .select("id")
    .eq("symbol", tokenSelected);
  return data[0].id;
};

export const getTokenAddressById = async (tokenId) => {
  const { data } = await supabase
    .from("tokens")
    .select("address")
    .eq("id", tokenId);
  return data[0].address;
};
