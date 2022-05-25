/* eslint-disable no-unused-vars */
import supabase from "../supabase";

import config, {
  walletConnect,
  MAIN_FACTORY_CELO_MAINNET,
} from "./config.main.web3";
import { CUSD_TOKEN_CELO_MAINNET } from "./config.erc";

const adminFee = 2;

const setCreateRound = async ({
  warranty,
  saving,
  groupSize,
  payTime,
  isPublic,
  walletAddress,
  provider,
}) =>
  (async function getFactoryMethods() {
    try {
      const factory = await new Promise((resolve, reject) => {
        if (provider !== "WalletConnect") {
          resolve(config());
        } else {
          resolve(walletConnect());
        }
      });

      await new Promise((resolve, reject) => {
        factory.contract.methods
          .createRound(
            warranty,
            saving,
            groupSize,
            adminFee,
            payTime,
            CUSD_TOKEN_CELO_MAINNET
          )
          .send({
            from: walletAddress,
            to: MAIN_FACTORY_CELO_MAINNET,
          })
          .once("receipt", async (receipt) => {
            const contract =
              receipt?.events?.RoundCreated?.returnValues?.childRound;
            const admin = receipt.from;
            const folio = receipt.transactionHash;

            const session = supabase.auth.session();
            await supabase
              .from("rounds")
              .insert([
                {
                  createByUser: session.user.id,
                  createByWallet: admin,
                  contract,
                  folio,
                  isPublic,
                  createTime: new Date().getTime(),
                  // positions: [],
                  // invitations: [],
                },
              ])
              .then((data) => {
                console.log("Supabase Data ", data);
                resolve(data);
              })
              .catch((error) => {
                console.log("Supabase Insert Error ", error);
                reject(error);
              });
          })
          .on("error", async (error) => {
            reject(error);
          });
      });
    } catch (error) {
      console.log("catch Error ", error);
    }
  })();

export default setCreateRound;
