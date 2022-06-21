import {
  CUSD_TOKEN_CELO_MAINNET,
  configCUSD,
  walletConnect,
} from "./config.erc";

import supabase from "../supabase";

const setRegisterUser = async (props) => {
  const { walletAddress, roundId, provider } = props;
  console.log(roundId);
  const { data } = await supabase.from("rounds").select().eq("id", roundId);
  console.log(data);
  const cUSD = await new Promise((resolve, reject) => {
    try {
      if (provider !== "WalletConnect") {
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
      .approve(data[0].contract, "300000000000000000000")
      .send({ from: walletAddress, to: CUSD_TOKEN_CELO_MAINNET })
      .once("receipt", async (receipt) => {
        resolve(receipt);
      })
      .on("error", async (err) => {
        console.log(err);
        reject(err);
      });
  });
};

export default setRegisterUser;
