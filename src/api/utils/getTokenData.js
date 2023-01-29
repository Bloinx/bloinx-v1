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
