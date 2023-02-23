import { selectTokenAddress, configCUSD, walletConnect } from "./config.erc";
import getGasFee from "./utils/getGasFee";

import supabase from "../supabase";

const userData = localStorage.getItem("user_address");

const amountToApprove = {
  4: "300000000",
  3: "300000000",
  1: "300000000000000000000",
  2: "300000000000000000000",
};

const setRegisterUser = async (props) => {
  const { walletAddress, roundId, wallet } = props;
  const { chainId } = userData ? JSON.parse(userData) : null;

  const { data } = await supabase.from("rounds").select().eq("id", roundId);
  const token = selectTokenAddress(chainId);
  const gasFee = await getGasFee(chainId);
  console.log({ gasFee });
  const cUSD = await new Promise((resolve, reject) => {
    try {
      if (wallet !== "WalletConnect") {
        resolve(configCUSD());
      } else {
        resolve(walletConnect());
      }
    } catch (error) {
      reject(error);
    }
  });

  return new Promise((resolve, reject) => {
    cUSD.methods
      .approve(data[0].contract, amountToApprove[data[0].tokenId])
      .send({ from: walletAddress, to: token, gasPrice: gasFee })
      .once("receipt", async (receipt) => {
        resolve(receipt);
      })
      .on("error", async (err) => {
        reject(err);
      });
  });
};

export default setRegisterUser;
