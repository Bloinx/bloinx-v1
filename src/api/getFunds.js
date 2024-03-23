import { newKit } from "@celo/contractkit";
import Decimal from "decimal.js";
import { ALFAJORES_RPC_URL, CELO_MAINNET_RPC_URL } from "../utils/constants";
import getERC20TokenBalance from "./methods/getERC20TokenBalance";

function formatBalance(rawBalance, decimals) {
  if (rawBalance === undefined || decimals === undefined) {
    console.error("formatBalance called with undefined rawBalance or decimals");
    return "0.000";
  }

  const scaleFactor = new Decimal(10).pow(decimals);
  return new Decimal(rawBalance.toString())
    .dividedBy(scaleFactor)
    .toFixed(3)
    .toString();
}
async function getCeloBalance(address, kit) {
  const goldToken = await kit.contracts.getGoldToken();
  const balance = await goldToken.balanceOf(address);

  const decimals = 18;
  return {
    name: "CELO",
    balance: formatBalance(balance, decimals),
  };
}

const getFunds = async (walletAddress, provider) => {
  if (provider === 44787 || provider === 42220) {
    const kit = newKit(
      provider === 44787 ? ALFAJORES_RPC_URL : CELO_MAINNET_RPC_URL
    );

    // Replace with your MetaMask or Celo Wallet account address
    const accountAddress = walletAddress;
    // Get the wrapper for the StableToken (cUSD)
    const stableTokenWrapper = await kit.contracts.getStableToken();
    // Get token details
    const nameToken = await stableTokenWrapper.symbol();
    const balance = await stableTokenWrapper.balanceOf(accountAddress);
    const decimalsString = (await stableTokenWrapper.decimals()).toString();
    const decimals = parseInt(decimalsString, 10);
    const cusdFormat = formatBalance(balance, decimals);
    const celoBalance = await getCeloBalance(walletAddress, kit);
    return [{ name: nameToken, balance: cusdFormat }, celoBalance];
  }

  const result = await getERC20TokenBalance(walletAddress, provider);
  return result;
};

export default getFunds;
