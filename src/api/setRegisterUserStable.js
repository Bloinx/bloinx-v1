import {
  CUSD_TOKEN_CELO_MAINNET,
  configCUSD,
  walletConnect,
} from "./config.erc";

const setRegisterUser = async (props) => {
  const { walletAddress, provider } = props;
  // const docRef = doc(db, "round", roundId);
  // const docSnap = await getDoc(docRef);
  // const data = docSnap.data();

  const cUSD = await new Promise((resolve, reject) => {
    try {
      if (provider !== "WalletConnect") {
        resolve(configCUSD());
      } else {
        resolve(walletConnect());
      }
    } catch (error) {
      reject(error);
    }
  });
  const data = { contract: "" };
  return new Promise((resolve, reject) => {
    cUSD.methods
      .approve(data.contract, "300000000000000000000")
      .send({ from: walletAddress, to: CUSD_TOKEN_CELO_MAINNET })
      .once("receipt", async (receipt) => {
        resolve(receipt);
      })
      .on("error", async (err) => {
        console.log(err);
        reject(err);
      });
  });
};

export default setRegisterUser;
