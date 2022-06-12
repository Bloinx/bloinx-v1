import supabase from "../supabase";
import config, { walletConnect } from "./config.sg.web3";

const updateInvite = async (email, idRound) => {
  const { data, error } = await supabase
    .from("invitationsByRound")
    .update({ isRegister: true })
    .match({ userEmail: email, idRound });
  if (error) console.log(error);
  if (data) console.log(error);
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
  const { data, error } = await supabase.from("positionByRound").insert({
    idUser: userId,
    position,
    alias: name,
    motivation,
    wallet: walletAddress,
    idRound,
  });
  if (error) console.log(error);
  if (data) await updateInvite(email, idRound);
  return data;
};

const setRegisterUser = async (props) => {
  const {
    userId,
    walletAddress,
    roundId,
    name,
    motivation,
    position,
    provider,
  } = props;

  const user = supabase.auth.user();

  const { data } = await supabase
    .from("rounds")
    .select("id")
    .match({ id: roundId });

  const sg = await new Promise((resolve, reject) => {
    try {
      if (provider !== "WalletConnect") {
        resolve(config(data.contract));
      } else {
        resolve(walletConnect(data.contract));
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
        to: data.contract,
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
