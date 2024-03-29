/* eslint-disable no-unused-vars */
import supabase from "../supabase";

import config, {
  walletConnect,
  selectContractAddress,
} from "./config.main.web3";
import { selectTokenAddress } from "./config.erc";
import { getTokenId, getTokenIdP, getTokenAddress } from "./utils/getTokenData";
import getGasFee from "./utils/getGasFee";

const adminFee = 2;
const BLX_TOKEN_CELO_MAINNET = "0x37836007FC99C7cB3D4590cb466692ff7690074c"; // BLX

const setCreateRound = async ({
  warranty,
  saving,
  groupSize,
  payTime,
  tokenSelected,
  isPublic,
  currentAddress,
  wallet,
  currentProvider,
}) =>
  (async function getFactoryMethods() {
    const gasFee = await getGasFee(currentProvider);
    const tokenAddress = await getTokenAddress(tokenSelected);

    try {
      const factory = await new Promise((resolve, reject) => {
        if (wallet !== "WalletConnect") {
          resolve(config(currentProvider));
        } else {
          resolve(walletConnect());
        }
      });

      if (currentProvider === 42220 || currentProvider === 44787) {
        const token = selectTokenAddress(currentProvider);
        await new Promise((resolve, reject) => {
          factory.contract.methods
            .createRound(
              warranty,
              saving,
              groupSize,
              adminFee,
              payTime,
              token,
              BLX_TOKEN_CELO_MAINNET
            )
            .send({
              from: currentAddress,
              to: selectContractAddress(currentProvider),
              maxFeePerGas: gasFee.maxFeePerGas,
              maxPriorityFeePerGas: gasFee.maxPriorityFeePerGas,
            })
            .once("receipt", async (receipt) => {
              const contract =
                receipt?.events?.RoundCreated?.returnValues?.childRound;
              const admin = receipt.from;
              const folio = receipt.transactionHash;
              const session = supabase.auth.session();
              const idUser = session.user.id;
              const tokenIds = await getTokenId(currentProvider);
              await supabase
                .from("rounds")
                .insert([
                  {
                    userAdmin: idUser,
                    wallet: admin,
                    contract,
                    folio,
                    isPublic,
                    tokenId: tokenIds,
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
      } else {
        await new Promise((resolve, reject) => {
          factory.contract.methods
            .createRound(
              warranty,
              saving,
              groupSize,
              adminFee,
              payTime,
              tokenAddress,
              "0x0000000000000000000000000000000000000000"
            )
            .send({
              from: currentAddress,
              to: selectContractAddress(currentProvider),
              maxFeePerGas: gasFee.maxFeePerGas,
              maxPriorityFeePerGas: gasFee.maxPriorityFeePerGas,
            })
            .once("receipt", async (receipt) => {
              const contract =
                receipt?.events?.RoundCreated?.returnValues?.childRound;
              const admin = receipt.from;
              const folio = receipt.transactionHash;
              const session = supabase.auth.session();
              const idUser = session.user.id;
              const tokenIds = await getTokenIdP(tokenSelected);
              await supabase
                .from("rounds")
                .insert([
                  {
                    userAdmin: idUser,
                    wallet: admin,
                    contract,
                    folio,
                    isPublic,
                    tokenId: tokenIds,
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
    } catch (error) {
      console.log(error);
    }
  })();

export default setCreateRound;
