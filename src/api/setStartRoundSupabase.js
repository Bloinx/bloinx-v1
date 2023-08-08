/* eslint-disable no-unused-vars */
import config, { walletConnect } from "./config.sg.web3";
import supabase from "../supabase";
import getGasFee from "./utils/getGasFee";

const api = async (roundId, wallet, chainId) => {
  const { data } = await supabase.from("rounds").select().eq("id", roundId);

  const gasFee = await getGasFee(chainId);

  const sg = await new Promise((resolve, reject) => {
    try {
      if (wallet !== "WalletConnect") {
        resolve(config(data[0].contract, chainId));
      } else {
        resolve(walletConnect(data[0].contract));
      }
    } catch (error) {
      reject(error);
    }
  });

  // const sg = await config(data.contract);
  return new Promise((resolve, reject) => {
    sg.methods
      .startRound()
      .send({
        from: data[0].wallet,
        to: data[0].contract,
        maxFeePerGas: gasFee.maxFeePerGas,
        maxPriorityFeePerGas: gasFee.maxPriorityFeePerGas,
      })
      .once("receipt", async (receipt) => {
        // await updateDoc(docRef, {
        //   invitations: [],
        // });
        resolve(receipt);
      })
      .on("error", async (error) => {
        reject(error);
      });
  });
};

export default api;
