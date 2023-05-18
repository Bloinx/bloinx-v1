import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { newKitFromWeb3 } from "@celo/contractkit";
import { RPC_URL } from "../constants/web3Providers";
import SavingGroups from "../abis/SavingGroups.json";
import SavingGroupsP from "../abis/SavingGroupsP.json";

export default async function config(savingGroupAddress, currentProvider) {
  try {
    const rpcUrl = RPC_URL[currentProvider];

    const httpProvider = new Web3.providers.HttpProvider(rpcUrl, {
      timeout: 10000,
    });

    const web3Provider = new Web3(
      window?.web3?.currentProvider || httpProvider
    );
    const ABI = currentProvider === 42220 ? SavingGroups : SavingGroupsP;
    const contract = new web3Provider.eth.Contract(ABI, savingGroupAddress);

    return contract;
  } catch (error) {
    return error;
  }
}

export async function walletConnect(savingGroupAddress) {
  const provider = new WalletConnectProvider({
    rpc: {
      ...RPC_URL,
    },
  });
  await provider.enable();
  const web3Provider = new Web3(provider);
  const kit = newKitFromWeb3(web3Provider);
  // eslint-disable-next-line prefer-destructuring
  kit.defaultAccount = provider.accounts[0];
  kit.defaultFeeCurrency = await kit.contracts.getStableToken();

  const contract = new web3Provider.eth.Contract(
    SavingGroups,
    savingGroupAddress
  );

  return contract;
}
