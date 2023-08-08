import axios from "axios";
import Web3 from "web3";

const MUMBAI_GAS_STATION = "https://gasstation-testnet.polygon.technology/v2";
const POLYGON_GAS_STATION = "https://gasstation.polygon.technology/v2";

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
        const { standard, estimatedBaseFee } = result?.data;
        console.log(result?.data);
        const formattedMaxPriorityFee = Number(standard.maxPriorityFee).toFixed(
          9
        );
        const formattedEstimatedBaseFee = Number(estimatedBaseFee).toFixed(9);

        const maxPriorityFeePerGasTemp = Web3.utils.toWei(
          formattedMaxPriorityFee,
          "gwei"
        );
        const maxFeePerGasTemp = Web3.utils.toWei(
          formattedEstimatedBaseFee,
          "gwei"
        );

        maxPriorityFeePerGas = Number(maxPriorityFeePerGasTemp);
        maxFeePerGas = Number(maxFeePerGasTemp) + maxPriorityFeePerGas;
      } catch (error) {
        console.log("[ERROR] !! ", error);
      }
      break;
    case 80001:
      try {
        const result = await axios.get(MUMBAI_GAS_STATION);
        const { standard, estimatedBaseFee } = result?.data;
        const formattedMaxPriorityFee = standard.maxPriorityFee.toFixed(9);
        const maxPriorityFeePerGasTemp = Web3.utils.toWei(
          formattedMaxPriorityFee,
          "gwei"
        );

        maxPriorityFeePerGas = Number(maxPriorityFeePerGasTemp);

        const formattedEstimatedBaseFeeTemp = estimatedBaseFee * 10 ** 8;
        const formattedEstimatedBaseFee =
          formattedEstimatedBaseFeeTemp.toFixed(9);

        const maxFeePerGasTemp = Web3.utils.toWei(
          formattedEstimatedBaseFee,
          "gwei"
        );
        maxFeePerGas = Number(maxFeePerGasTemp) + maxPriorityFeePerGas;
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
        maxFeePerGas = Web3.utils.toWei(formattedFee.toString(), "wei");
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
        maxFeePerGas = Web3.utils.toWei(formattedFee.toString(), "wei");
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
  // console.log(transactionProperties);

  return transactionProperties;
};

export default getGasFee;
