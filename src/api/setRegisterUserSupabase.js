import supabase from "../supabase";
import config, { walletConnect } from "./config.sg.web3";
import getGasFee from "./utils/getGasFee";

const userData = localStorage.getItem("user_address");

const updateInvite = async (email, idRound) => {
  await supabase
    .from("invitationsByRound")
    .update({ isRegister: true })
    .match({ userEmail: email, idRound });
};
const setRegisterPosition = async (
  email,
  idRound,
  userId,
  position,
  name,
  motivation,
  walletAddress
) => {
  const { data } = await supabase.from("positionByRound").insert({
    idUser: userId,
    position,
    alias: name,
    motivation,
    wallet: walletAddress,
    idRound,
  });

  if (data) await updateInvite(email, idRound);
  return data;
};

const setRegisterUser = async (props) => {
  const { userId, walletAddress, roundId, name, motivation, position, wallet } =
    props;
  const { chainId } = userData ? JSON.parse(userData) : null;
  const gasFee = await getGasFee(chainId);
  const user = supabase.auth.user();

  const { data } = await supabase.from("rounds").select().eq("id", roundId);
  console.log({ data });
  const sg = await new Promise((resolve, reject) => {
    try {
      if (wallet !== "WalletConnect") {
        resolve(config(data[0].contract));
      } else {
        resolve(walletConnect(data[0].contract));
      }
    } catch (error) {
      reject(error);
    }
  });
  // const sg = await config(data.contract, provider);

  return new Promise((resolve, reject) =>
    sg.methods
      .registerUser(position)
      .send({
        from: walletAddress,
        to: data[0].contract,
        maxFeePerGas: gasFee.maxFeePerGas,
        maxPriorityFeePerGas: gasFee.maxPriorityFeePerGas,
      })
      .once("receipt", async (recpt) => {
        const res = await setRegisterPosition(
          user.email,
          roundId,
          userId,
          position,
          name,
          motivation,
          walletAddress
        );
        if (res) resolve(recpt);
      })
      .on("error", async (error) => {
        reject(error);
      })
  );
};

export default setRegisterUser;
