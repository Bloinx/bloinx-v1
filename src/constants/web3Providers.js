import WalletConnectProvider from "@walletconnect/web3-provider";
import { ALFAJORES_RPC_URL, CELO_MAINNET_RPC_URL } from "../utils/constants";

export const RPC_URL = {
  137: "https://rpc-mainnet.maticvigil.com",
  80001: "https://rpc-mumbai.maticvigil.com/",
  44787: ALFAJORES_RPC_URL,
  42220: CELO_MAINNET_RPC_URL,
};

export function walletconnect(id, QR) {
  return new WalletConnectProvider({
    rpc: RPC_URL,
    chainId: id,
    bridge: "https://bridge.walletconnect.org",
    qrcode: QR,
  });
}
