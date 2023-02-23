import WalletConnectProvider from "@walletconnect/web3-provider";

export const RPC_URL = {
  137: "https://polygon-mainnet.g.alchemy.com/v2/LR3v9e4QrAHr6kd_JDnVgrdXPZzTOdfK",
  80001:
    "https://polygon-mumbai.g.alchemy.com/v2/EPFh1qnXg70wRUSBjnE_YiBrkwNa_b31",
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
