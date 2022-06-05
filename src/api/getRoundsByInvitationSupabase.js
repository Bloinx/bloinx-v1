/* eslint-disable no-unused-vars */
import supabase from "../supabase";
import config, { walletConnect } from "./config.sg.web3";

import MethodGetStage from "./methods/getStage";

const getRounds = async ({ email, provider }) => {
  const getUserAdminEmail = async (idUserAdmin) => {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .match({ id: idUserAdmin });

    return data[0].email;
  };
  const configByInvitation = async (invite) => {
    const { data } = await supabase
      .from("rounds")
      .select("id")
      .match({ id: invite.idRound });

    const sg =
      (await provider) !== "WalletConnect"
        ? await config(data[0].contract)
        : await walletConnect(data[0].contract);
    const stage = await MethodGetStage(sg.methods);

    const userAdminEmail = await getUserAdminEmail(data[0].userAdmin);

    const roundData = {
      stage,
      roundKey: data[0].id,
      toRegister: true,
      fromInvitation: true,
      fromEmail: userAdminEmail,
    };

    return roundData;
  };

  const { data } = await supabase
    .from("invitationsByRound")
    .select("userEmail, isRegister")
    .match({ userEmail: email, isRegister: false });

  return new Promise((resolve) => {
    const rounds = [];
    data.map(async (invite) => {
      const roundData = await configByInvitation(invite);
      rounds.push(roundData);
    });
    resolve(rounds.sort());
  });
};

export default getRounds;
