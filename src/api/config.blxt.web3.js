import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { newKitFromWeb3 } from "@celo/contractkit";
import BLXToken from "../abis/BLXToken.json";

export default async function config(BLXAddress) {
  try {
    const httpProvider = new Web3.providers.HttpProvider(
      "https://forno.celo.org",
      {
        timeout: 10000,
      }
    );

    const web3Provider = new Web3(
      window?.ethereum.HttpProvider || httpProvider
    );

    const contract = new web3Provider.eth.Contract(BLXToken, BLXAddress);

    return contract;
  } catch (error) {
    return error;
  }
}

export async function walletConnect(BLXAddress) {
  const provider = new WalletConnectProvider({
    rpc: {
      44787: "https://alfajores-forno.celo-testnet.org",
      42220: "https://forno.celo.org",
    },
  });
  await provider.enable();
  const web3Provider = new Web3(provider);
  const kit = newKitFromWeb3(web3Provider);
  // eslint-disable-next-line prefer-destructuring
  kit.defaultAccount = provider.accounts[0];
  kit.defaultFeeCurrency = await kit.contracts.getStableToken();

  const contract = new web3Provider.eth.Contract(BLXToken, BLXAddress);

  return contract;
}

// 0x37836007FC99C7cB3D4590cb466692ff7690074c
