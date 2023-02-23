import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { newKitFromWeb3 } from "@celo/contractkit";
import { RPC_URL } from "../constants/web3Providers";
import Main from "../abis/Main.json";
import MainP from "../abis/MainP.json";

export const MAIN_FACTORY_ALFAJORES =
  "0xd53E64384Aa1aa736e4B2FD8143D901EFB9CBa8B";

export const MAIN_FACTORY_CELO_MAINNET =
  "0xfF0e77E52bC1B21F4b4CE6d77ac48E3f9abdb5fE";

export const MAIN_FACTORY_MUMBAI = "0xC0Bb95455480C17D8136c1255e7fF06f915d3Dd6";

export const MAIN_FACTORY_POLYGON =
  "0x7D69E4A1e8da9D19FC63836F0acAD2052146F202";

export async function getContract(provider, abi, contractAddress) {
  const contract = await new provider.eth.Contract(abi, contractAddress);
  console.log({ contract });
  return contract;
}

export const selectContractAddress = (network) => {
  if (network === 42220) {
    return MAIN_FACTORY_CELO_MAINNET;
  }
  if (network === 44787) {
    return MAIN_FACTORY_ALFAJORES;
  }
  if (network === 137) {
    return MAIN_FACTORY_POLYGON;
  }
  return MAIN_FACTORY_MUMBAI;
};

export const selectContractABI = (network) => {
  if (network === 44787 || network === 42220) {
    return Main;
  }
  return MainP;
};

export default async function config() {
  try {
    const userData = localStorage.getItem("user_address");

    const { chainId } = JSON.parse(userData);
    const rpcUrl = RPC_URL[chainId];

    console.log({ rpcUrl });
    const httpProvider = new Web3.providers.HttpProvider(rpcUrl, {
      timeout: 10000,
    });

    const web3Provider = new Web3(
      window?.web3?.currentProvider || httpProvider
    );

    const ABI = selectContractABI(chainId);
    const contractAddress = selectContractAddress(chainId);
    const contract = await getContract(web3Provider, ABI, contractAddress);

    return { contract, web3Provider };
  } catch (error) {
    return error;
  }
}

export async function walletConnect() {
  try {
    const userData = localStorage.getItem("user_address");

    const { chainId } = JSON.parse(userData);
    const provider = new WalletConnectProvider({
      rpc: {
        ...RPC_URL,
      },
    });
    await provider.enable();
    const web3Provider = new Web3(provider);

    const ABI = selectContractABI(chainId);
    const contractAddress = selectContractAddress(chainId);

    if (chainId === 42220 || chainId === 44787) {
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
