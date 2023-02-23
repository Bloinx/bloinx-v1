/* eslint-disable no-unused-vars */
import supabase from "../supabase";
import config, { walletConnect } from "./config.sg.web3";
import MethodGetRealTurn from "./methods/getRealTurn";
import MethodGetGroupSize from "./methods/getGroupSize";
import MethodSetEndRound from "./methods/setEndRound";
import getGasFee from "./utils/getGasFee";

const userData = localStorage.getItem("user_address");

const setWithdrawTurn = async (roundId, walletAddress, wallet) => {
  const { data } = await supabase.from("rounds").select().eq("id", roundId);
  const { chainId } = userData ? JSON.parse(userData) : null;
  const gasFee = await getGasFee(chainId);

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
  const groupSize = await MethodGetGroupSize(sg.methods);
  const realTurn = await MethodGetRealTurn(sg.methods);

  return new Promise((resolve, reject) => {
    sg.methods
      .withdrawTurn()
      .send({
        from: walletAddress,
        to: data[0].contract,
        gasPrice: gasFee,
      })
      .once("receipt", async (receipt) => {
        if (Number(realTurn) > Number(groupSize)) {
          MethodSetEndRound(sg.methods, {
            walletAddress,
            contract: data[0].contract,
          })
            .then((endReceipt) => {
              resolve([receipt, endReceipt]);
            })
            .catch((endErr) => {
              const er = [receipt, endErr];
              reject(er);
            });
        } else {
          resolve(receipt);
        }
      })
      .on("error", async (error) => {
        reject(error);
      });
  });
};

export default setWithdrawTurn;
