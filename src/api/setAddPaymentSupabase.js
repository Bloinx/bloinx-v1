/* eslint-disable no-unused-vars */
import config, { walletConnect } from "./config.sg.web3";
import MethodGetSaveAmount from "./methods/saveAmount";
import supabase from "../supabase";

const setAddPayment = async (props) => {
  const { walletAddress, roundId, provider } = props;

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

  const saveAmount = await MethodGetSaveAmount(sg.methods);

  return new Promise((resolve, reject) => {
    sg.methods
      .addPayment(saveAmount)
      .send({
        from: walletAddress,
        to: data.contract,
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
