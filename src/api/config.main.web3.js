import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { newKitFromWeb3 } from "@celo/contractkit";
import { RPC_URL } from "../constants/web3Providers";
import Main from "../abis/Main.json";
import MainP from "../abis/MainP.json";
import { selectContractAddress } from "../utils/constants";

export async function getContract(provider, abi, contractAddress) {
  const contract = await new provider.eth.Contract(abi, contractAddress);
  return contract;
}

export const selectContractABI = (network) => {
  if (network === 44787 || network === 42220) {
    return Main;
  }
  return MainP;
};

export default async function config(networkSelected) {
  try {
    const rpcUrl = RPC_URL[networkSelected];

    // console.log({ rpcUrl });
    const httpProvider = new Web3.providers.HttpProvider(rpcUrl, {
      timeout: 10000,
    });

    const web3Provider = new Web3(
      window?.web3?.currentProvider || httpProvider
    );

    const ABI = selectContractABI(networkSelected);
    const contractAddress = selectContractAddress(networkSelected);
    const contract = await getContract(web3Provider, ABI, contractAddress);

    return { contract, web3Provider };
  } catch (error) {
    return error;
  }
}

export async function walletConnect(networkSelected) {
  try {
    const provider = new WalletConnectProvider({
      rpc: {
        ...RPC_URL,
      },
    });
    await provider.enable();
    const web3Provider = new Web3(provider);

    const ABI = selectContractABI(networkSelected);
    const contractAddress = selectContractAddress(networkSelected);

    if (networkSelected === 42220 || networkSelected === 44787) {
      const kit = newKitFromWeb3(web3Provider);
      // eslint-disable-next-line prefer-destructuring
      kit.defaultAccount = provider.accounts[0];
      kit.defaultFeeCurrency = await kit.contracts.getStableToken();

      const contract = await getContract(kit.web3, ABI, contractAddress);
      return { contract, provider };
    }
    const contract = await getContract(ABI, contractAddress);
    return { contract, provider };
  } catch (error) {
    return error;
  }
}
