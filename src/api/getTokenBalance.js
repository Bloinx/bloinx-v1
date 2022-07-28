import config, { walletConnect } from "./config.blxt.web3";
import MethodGetTokenBalance from "./methods/getTokenBalance";

const getTokenBLX = async (address, provider) => {
  const sg =
    (await provider) !== "WalletConnect"
      ? await config("0x37836007FC99C7cB3D4590cb466692ff7690074c")
      : await walletConnect("0x37836007FC99C7cB3D4590cb466692ff7690074c");

  const balance = await MethodGetTokenBalance(sg.methods, address);

  return balance;
};
export default getTokenBLX;
