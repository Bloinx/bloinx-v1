import axios from "axios";
import Web3 from "web3";

const MUMBAI_GAS_STATION = "https://gasstation-mumbai.matic.today/v2";
const POLYGON_GAS_STATION = "https://gasstation-mainnet.matic.network/v2";

const ALFAJORES_GAS_STATION =
  "https://api-alfajores.celoscan.io/api?module=proxy&action=eth_gasPrice&apikey=key";
const CELO_GAS_STATION =
  "https://api.celoscan.io/api?module=proxy&action=eth_gasPrice&apikey=key";

const getGasFee = async (chainId) => {
  let baseFee = 0;

  switch (chainId) {
    case 137:
      try {
        const result = await axios.get(POLYGON_GAS_STATION);
        const { standard } = result?.data;
        const formattedFee = standard.maxPriorityFee.toFixed(9);
        baseFee = Web3.utils.toWei(formattedFee, "gwei");
      } catch (error) {
        console.log("[ERROR] !! ", error);
      }
      break;
    case 80001:
      try {
        const result = await axios.get(MUMBAI_GAS_STATION);
        const { standard } = result?.data;
        const formattedFee = standard.maxPriorityFee.toFixed(9);
        baseFee = Web3.utils.toWei(formattedFee, "gwei");
      } catch (error) {
        console.log("[ERROR] !! ", error);
      }
      break;
    case 44787:
      try {
        const result = await axios.get(ALFAJORES_GAS_STATION);
        const { result: standard } = result?.data;
        const formattedFee = parseInt(standard, 16);
        baseFee = Web3.utils.toWei(formattedFee.toString(), "wei");
      } catch (error) {
        console.log("[ERROR] !! ", error);
      }
      break;
    case 42220:
      try {
        const result = await axios.get(CELO_GAS_STATION);
        const { result: standard } = result?.data;
        const formattedFee = parseInt(standard, 16);
        baseFee = Web3.utils.toWei(formattedFee.toString(), "wei");
      } catch (error) {
        console.log("[ERROR] !! ", error);
      }
      break;
    default:
      console.log("[ERROR] !! Invalid Network");
      break;
  }
  return baseFee;
};

export default getGasFee;
