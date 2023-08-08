import web3 from "web3";
import config, { walletConnect } from "./config.blxt.web3";
import MethodGetTokenBalance from "./methods/getTokenBalance";

const getTokenBLX = async (address, wallet) => {
  const sg =
    (await wallet) !== "WalletConnect"
      ? await config("0x37836007FC99C7cB3D4590cb466692ff7690074c")
      : await walletConnect("0x37836007FC99C7cB3D4590cb466692ff7690074c");

  const balance = await MethodGetTokenBalance(sg.methods, address);
  return web3.utils.fromWei(balance, "ether");
};
export default getTokenBLX;
