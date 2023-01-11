import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { newKitFromWeb3 } from "@celo/contractkit";
import { RPC_URL } from "../constants/web3Providers";
import Main from "../abis/Main.json";
import MainP from "../abis/MainP.json";

export const MAIN_FACTORY_ALFAJORES =
  "0x5379Db9Fb4e50572F161A8c3E0685448271Df72F";

export const MAIN_FACTORY_CELO_MAINNET =
  "0xfF0e77E52bC1B21F4b4CE6d77ac48E3f9abdb5fE";

export const MAIN_FACTORY_MUMBAI = "0x9d7E6A5fE13C335DEE43F3DeEc366Fa75FA616Da";

export const MAIN_FACTORY_POLYGON = "0x000000000";

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
  const provider = new WalletConnectProvider({
    rpc: {
      ...RPC_URL,
    },
  });
  await provider.enable();
  const web3Provider = new Web3(provider);
  console.log({ web3Provider });

  // TODO: chainId Validation
  const kit = newKitFromWeb3(web3Provider);
  // eslint-disable-next-line prefer-destructuring
  kit.defaultAccount = provider.accounts[0];
  kit.defaultFeeCurrency = await kit.contracts.getStableToken();

  const contract = await getContract(kit.web3, Main, MAIN_FACTORY_CELO_MAINNET);
  return { contract, provider };
}
