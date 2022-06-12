/* eslint-disable no-unused-vars */
import config, { walletConnect } from "./config.sg.web3";
import supabase from "../supabase";

const api = async (roundId, provider) => {
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
  return new Promise((resolve, reject) => {
    sg.methods
      .startRound()
      .send({
        from: data.wallet,
        to: data.contract,
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
