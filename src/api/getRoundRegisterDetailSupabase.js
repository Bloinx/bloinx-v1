import MethodGetAvailablePlaces from "./methods/getAvailablePlaces";
import MethodGetCashIn from "./methods/getCashIn";
import MethodGetFeeCost from "./methods/getFeeCost";
import config, { walletConnect } from "./config.sg.web3";
import supabase from "../supabase";

const getRoundRegisterDetail = async (roundId, provider) => {
  try {
    const { data } = await supabase
      .from("rounds")
      .select("id")
      .match({ id: roundId });

    const sg = await new Promise((resolve, reject) => {
      try {
        if (provider !== "WalletConnect") {
          resolve(config(data.contract));
        } else {
          resolve(walletConnect(data.contract));
        }
      } catch (error) {
        reject(error);
      }
    });
    // const sg = await config(data.contract);
    const positionsAvailable = await MethodGetAvailablePlaces(sg.methods);
    const cashIn = await MethodGetCashIn(sg.methods);
    const feeCost = await MethodGetFeeCost(sg.methods);

    return {
      ...data,
      roundId,
      positionsAvailable,
      cashIn: (Number(cashIn) * 10 ** -18).toFixed(2),
      feeCost: (Number(feeCost) * 10 ** -18).toFixed(2),
    };
  } catch (err) {
    return err;
  }
};

export default getRoundRegisterDetail;
