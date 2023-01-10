/* eslint-disable no-unused-vars */
import supabase from "../supabase";

import config, {
  walletConnect,
  selectContractAddress,
} from "./config.main.web3";
import { selectTokenAddress } from "./config.erc";

const adminFee = 2;
const BLX_TOKEN_CELO_MAINNET = "0x37836007FC99C7cB3D4590cb466692ff7690074c"; // BLX
const userData = localStorage.getItem("user_address");

const setCreateRound = async ({
  warranty,
  saving,
  groupSize,
  payTime,
  isPublic,
  currentAddress,
  wallet,
}) =>
  (async function getFactoryMethods() {
    const { chainId } = userData ? JSON.parse(userData) : null;

    try {
      const factory = await new Promise((resolve, reject) => {
        if (wallet !== "WalletConnect") {
          resolve(config());
        } else {
          resolve(walletConnect());
        }
      });

      if (chainId === 42220 || chainId === 44787) {
        await new Promise((resolve, reject) => {
          factory.contract.methods
            .createRound(
              warranty,
              saving,
              groupSize,
              adminFee,
              payTime,
              selectTokenAddress(chainId),
              BLX_TOKEN_CELO_MAINNET
            )
            .send({
              from: currentAddress,
              to: selectContractAddress(chainId),
            })
            .once("receipt", async (receipt) => {
              const contract =
                receipt?.events?.RoundCreated?.returnValues?.childRound;
              const admin = receipt.from;
              const folio = receipt.transactionHash;
              const session = supabase.auth.session();
              const idUser = session.user.id;
              await supabase
                .from("rounds")
                .insert([
                  {
                    userAdmin: idUser,
                    wallet: admin,
                    contract,
                    folio,
                    isPublic,
                    chainId,
                  },
                ])
                .then((data) => {
                  resolve(data);
                })
                .catch((error) => {
                  reject(error);
                });
            })
            .on("error", async (error) => {
              reject(error);
            });
        });
      }

      await new Promise((resolve, reject) => {
        factory.contract.methods
          .createRound(
            warranty,
            saving,
            groupSize,
            adminFee,
            payTime,
            selectTokenAddress(chainId)
          )
          .send({
            from: currentAddress,
            to: selectContractAddress(chainId),
          })
          .once("receipt", async (receipt) => {
            const contract =
              receipt?.events?.RoundCreated?.returnValues?.childRound;
            const admin = receipt.from;
            const folio = receipt.transactionHash;
            const session = supabase.auth.session();
            const idUser = session.user.id;
            await supabase
              .from("rounds")
              .insert([
                {
                  userAdmin: idUser,
                  wallet: admin,
                  contract,
                  folio,
                  isPublic,
                  chainId,
                },
              ])
              .then((data) => {
                resolve(data);
              })
              .catch((error) => {
                reject(error);
              });
          })
          .on("error", async (error) => {
            reject(error);
          });
      });
    } catch (error) {
      console.log(error);
    }
  })();

export default setCreateRound;
