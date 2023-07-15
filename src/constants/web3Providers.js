import WalletConnectProvider from "@walletconnect/web3-provider";

export const RPC_URL = {
  137: "https://rpc-mainnet.maticvigil.com",
  80001: "https://rpc-mumbai.maticvigil.com/",
  44787: "https://alfajores-forno.celo-testnet.org",
  42220: "https://forno.celo.org",
};

export function walletconnect(id, QR) {
  return new WalletConnectProvider({
    rpc: RPC_URL,
    chainId: id,
    bridge: "https://bridge.walletconnect.org",
    qrcode: QR,
  });
}
