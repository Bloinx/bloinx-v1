import supabase from "../../supabase";

export const getTokenData = async (chainId) => {
  //   const userData = localStorage.getItem("user_address");
  //   const { chainId } = userData ? JSON.parse(userData) : null;

  const { data } = await supabase
    .from("tokens")
    .select()
    .eq("chainId", chainId);
  console.log(data);
  return data[0];
};

export const getTokenId = async (chainId) => {
  //   const userData = localStorage.getItem("user_address");
  //   const { chainId } = userData ? JSON.parse(userData) : null;
  console.log(chainId, "chainId");
  const { data } = await supabase
    .from("tokens")
    .select("id")
    .eq("chainId", chainId);
  console.log(data);
  return data;
};
