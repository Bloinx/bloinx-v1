import supabase from "../supabase";
import config, { walletConnect } from "./config.sg.web3";
import MethodGetFuturePayments from "./methods/getFuturePayments";
import { getTokenDecimals } from "./utils/getTokenData";

const getFuturePayments = async (
  roundId,
  currentAddress,
  wallet,
  currentProvider
) => {
  try {
    const { data } = await supabase.from("rounds").select().eq("id", roundId);

    const sg = await new Promise((resolve, reject) => {
      try {
        if (wallet !== "WalletConnect") {
          resolve(config(data[0]?.contract, currentProvider));
        } else {
          resolve(walletConnect(data[0]?.contract));
        }
      } catch (error) {
        reject(error);
      }
    });
    const tokenDecimals = await getTokenDecimals(data[0]?.tokenId);

    const futurePayments = await MethodGetFuturePayments(
      sg.methods,
      currentAddress
    );
    const result = (Number(futurePayments) * 10 ** -tokenDecimals).toFixed(2);

    return result;
  } catch (err) {
    return err;
  }
};

export default getFuturePayments;
