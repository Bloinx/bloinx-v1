import { configCUSD, walletConnect } from "./config.erc";
import getGasFee from "./utils/getGasFee";
import { getTokenAddressById } from "./utils/getTokenData";

import supabase from "../supabase";

const amountToApprove = {
  4: "300000000",
  3: "300000000",
  1: "300000000000000000000",
  2: "300000000000000000000",
  5: "300000000",
  7: "600000000000000000000",
  8: "600000000000000000000",
};

const setRegisterUser = async (props) => {
  const { walletAddress, roundId, wallet, chainId } = props;
  // const { chainId } = userData ? JSON.parse(userData) : null;
  const { data } = await supabase.from("rounds").select().eq("id", roundId);
  const gasFee = await getGasFee(chainId);
  const token = await getTokenAddressById(data[0].tokenId);

  const cUSD = await new Promise((resolve, reject) => {
    try {
      if (wallet !== "WalletConnect") {
        resolve(configCUSD(token, chainId));
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
      .send({
        from: walletAddress,
        to: token,
        gasFeemaxFeePerGas: gasFee.maxFeePerGas,
        maxPriorityFeePerGas: gasFee.maxPriorityFeePerGas,
      })
      .once("receipt", async (receipt) => {
        resolve(receipt);
      })
      .on("error", async (err) => {
        reject(err);
      });
  });
};

export default setRegisterUser;
