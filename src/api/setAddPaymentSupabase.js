/* eslint-disable no-unused-vars */
import config, { walletConnect } from "./config.sg.web3";
import MethodGetSaveAmount from "./methods/saveAmount";
import supabase from "../supabase";
import getGasFee from "./utils/getGasFee";

const setAddPayment = async (props) => {
  const { walletAddress, roundId, wallet, currentProvider } = props;

  const { data } = await supabase.from("rounds").select().eq("id", roundId);
  const gasFee = await getGasFee(currentProvider);

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

  const saveAmount = await MethodGetSaveAmount(sg.methods);

  return new Promise((resolve, reject) => {
    sg.methods
      .addPayment(saveAmount)
      .send({
        from: walletAddress,
        to: data[0].contract,
        maxFeePerGas: gasFee.maxFeePerGas,
        maxPriorityFeePerGas: gasFee.maxPriorityFeePerGas,
      })
      .once("receipt", async (receipt) => {
        resolve(receipt);
      })
      .on("error", async (error) => {
        reject(error);
      });
  });
};

export default setAddPayment;
