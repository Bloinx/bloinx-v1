import axios from "axios";
import Web3 from "web3";

const MUMBAI_GAS_STATION = "https://gasstation-mumbai.matic.today/v2";
const POLYGON_GAS_STATION = "https://gasstation-mainnet.matic.network/v2";

const ALFAJORES_GAS_STATION =
  "https://api-alfajores.celoscan.io/api?module=proxy&action=eth_gasPrice&apikey=key";
const CELO_GAS_STATION =
  "https://api.celoscan.io/api?module=proxy&action=eth_gasPrice&apikey=key";

const getGasFee = async (chainId) => {
  let maxPriorityFeePerGas = 0;
  let maxFeePerGas = 0;

  switch (chainId) {
    case 137:
      try {
        const result = await axios.get(POLYGON_GAS_STATION);
        const { standard } = result?.data;
        const formattedMaxPriorityFee = standard.maxPriorityFee.toFixed(9);
        const maxPriorityFeePerGasTemp = Web3.utils.toWei(
          formattedMaxPriorityFee,
          "gwei"
        );
        maxPriorityFeePerGas = Number(maxPriorityFeePerGasTemp);
        console.log(maxPriorityFeePerGas);
        const { estimatedBaseFee } = result?.data;
        console.log(estimatedBaseFee);
        const formattedestimatedBaseFeeTemp = estimatedBaseFee * 10 ** 8;
        const formattedestimatedBaseFee =
          formattedestimatedBaseFeeTemp.toFixed(9);
        console.log(formattedestimatedBaseFee);
        const maxFeePerGasTemp = Web3.utils.toWei(
          formattedestimatedBaseFee,
          "gwei"
        );
        console.log(maxFeePerGasTemp);
        maxFeePerGas = Number(maxFeePerGasTemp) + maxPriorityFeePerGas;
        console.log(maxFeePerGas);
      } catch (error) {
        console.log("[ERROR] !! ", error);
      }
      break;
    case 80001:
      try {
        const result = await axios.get(MUMBAI_GAS_STATION);
        const { standard } = result?.data;
        console.log(standard);
        const formattedMaxPriorityFee = standard.maxPriorityFee.toFixed(9);
        const maxPriorityFeePerGasTemp = Web3.utils.toWei(
          formattedMaxPriorityFee,
          "gwei"
        );
        maxPriorityFeePerGas = Number(maxPriorityFeePerGasTemp);
        console.log(maxPriorityFeePerGas);
        const { estimatedBaseFee } = result?.data;
        console.log(estimatedBaseFee);
        const formattedestimatedBaseFeeTemp = estimatedBaseFee * 10 ** 8;
        const formattedestimatedBaseFee =
          formattedestimatedBaseFeeTemp.toFixed(9);
        console.log(formattedestimatedBaseFee);
        const maxFeePerGasTemp = Web3.utils.toWei(
          formattedestimatedBaseFee,
          "gwei"
        );
        console.log(maxFeePerGasTemp);
        maxFeePerGas = Number(maxFeePerGasTemp) + maxPriorityFeePerGas;
        console.log(maxFeePerGas);
      } catch (error) {
        console.log("[ERROR] !! ", error);
      }
      break;
    case 44787:
      try {
        const result = await axios.get(ALFAJORES_GAS_STATION);
        const { result: standard } = result?.data;
        const formattedFee = parseInt(standard, 16);
        maxPriorityFeePerGas = Web3.utils.toWei(formattedFee.toString(), "wei");
      } catch (error) {
        console.log("[ERROR] !! ", error);
      }
      break;
    case 42220:
      try {
        const result = await axios.get(CELO_GAS_STATION);
        const { result: standard } = result?.data;
        const formattedFee = parseInt(standard, 16);
        maxPriorityFeePerGas = Web3.utils.toWei(formattedFee.toString(), "wei");
      } catch (error) {
        console.log("[ERROR] !! ", error);
      }
      break;
    default:
      console.log("[ERROR] !! Invalid Network");
      break;
  }

  const transactionProperties = {
    maxFeePerGas,
    maxPriorityFeePerGas,
  };
  console.log(transactionProperties);

  return transactionProperties;
};

export default getGasFee;
