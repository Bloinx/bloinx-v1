import MethodGetAvailablePlaces from "./methods/getAvailablePlaces";
import MethodGetCashIn from "./methods/getCashIn";
import MethodGetFeeCost from "./methods/getFeeCost";
import config, { walletConnect } from "./config.sg.web3";
import supabase from "../supabase";
import { getTokenDecimals } from "./utils/getTokenData";

const getRoundRegisterDetail = async (roundId, wallet, currentProvider) => {
  try {
    const { data } = await supabase.from("rounds").select().eq("id", roundId);

    const sg = await new Promise((resolve, reject) => {
      try {
        if (wallet !== "WalletConnect") {
          resolve(config(data[0].contract, currentProvider));
        } else {
          resolve(walletConnect(data[0].contract));
        }
      } catch (error) {
        reject(error);
      }
    });
    const positionsAvailable = await MethodGetAvailablePlaces(sg.methods);
    const cashIn = await MethodGetCashIn(sg.methods);
    const feeCost = await MethodGetFeeCost(sg.methods);

    const tokenDecimals = await getTokenDecimals(data[0].tokenId);
    return {
      ...data[0],
      roundId,
      positionsAvailable,
      cashIn: (Number(cashIn) * 10 ** -tokenDecimals).toFixed(2),
      feeCost: (Number(feeCost) * 10 ** -tokenDecimals).toFixed(2),
    };
  } catch (err) {
    return err;
  }
};

export default getRoundRegisterDetail;
