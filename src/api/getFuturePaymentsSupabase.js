import supabase from "../supabase";
import config, { walletConnect } from "./config.sg.web3";
import MethodGetFuturePayments from "./methods/getFuturePayments";

const getFuturePayments = async (roundId, currentAddress, currentProvider) => {
  try {
    const { data } = await supabase.from("rounds").select().eq("id", roundId);
    const sg = await new Promise((resolve, reject) => {
      try {
        if (currentProvider !== "WalletConnect") {
          resolve(config(data[0]?.contract));
        } else {
          resolve(walletConnect(data[0]?.contract));
        }
      } catch (error) {
        reject(error);
      }
    });
    // const sg = await config(data.contract);

    const futurePayments = await MethodGetFuturePayments(
      sg.methods,
      currentAddress
    );
    const result = (Number(futurePayments) * 10 ** -18).toFixed(2);

    return result;
  } catch (err) {
    return err;
  }
};

export default getFuturePayments;
