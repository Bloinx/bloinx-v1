/* eslint-disable no-unused-vars */
import config, { walletConnect } from "./config.sg.web3";
import MethodGetSaveAmount from "./methods/saveAmount";
import supabase from "../supabase";
import getGasFee from "./utils/getGasFee";

const setAddPayment = async (props) => {
  const { walletAddress, currentProvider, contract, sgMethods } = props;
  const gasFee = await getGasFee(currentProvider);
  const savedAmount = await MethodGetSaveAmount(sgMethods);
  return new Promise((resolve, reject) => {
    sgMethods
      .addPayment(savedAmount)
      .send({
        from: walletAddress,
        to: contract,
        maxFeePerGas: gasFee.maxFeePerGas,
        maxPriorityFeePerGas: gasFee.maxPriorityFeePerGas,
      })
      .once("receipt", async (receipt) => {
        resolve(receipt);
      })
      .on("error", async (error) => {
        reject(error);
      });
  });
};

export default setAddPayment;
