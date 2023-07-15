// import Web3 from "web3";
import { newKit } from "@celo/contractkit";
import Web3 from "web3";
import { RPC_URL } from "../constants/web3Providers";
// import SavingGroups from "../abis/SavingGroups.json";
// import SavingGroupsP from "../abis/SavingGroupsP.json";

const getFunds = async (walletAddress, networkSelected) => {
  const rpcUrl = RPC_URL[networkSelected];
  const kit = newKit(rpcUrl);
  let balanceOf;
  if (networkSelected === 42220 || networkSelected === 44787) {
    const goldtoken = await kit.contracts.getGoldToken();
    const balance = await goldtoken.balanceOf(walletAddress);
    balanceOf = Web3.utils.fromWei(balance.toString(), "ether");
  } else {
    const web3 = new Web3(rpcUrl);
    const balanceWei = await web3.eth.getBalance(walletAddress);
    const balance = web3.utils.fromWei(balanceWei, "ether");
    balanceOf = balance;
  }
  return balanceOf;
};

export default getFunds;
