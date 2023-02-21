/* eslint-disable no-unused-vars */
import config, { walletConnect } from "./config.sg.web3";
import supabase from "../supabase";

const api = async (roundId, wallet) => {
  const { data } = await supabase.from("rounds").select().eq("id", roundId);

  const sg = await new Promise((resolve, reject) => {
    try {
      if (wallet !== "WalletConnect") {
        resolve(config(data[0].contract));
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
