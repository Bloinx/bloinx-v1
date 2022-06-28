/* eslint-disable no-unused-vars */
import supabase from "../supabase";
import config, { walletConnect } from "./config.sg.web3";

import MethodGetStage from "./methods/getStage";

export const configByInvitation = async (round, provider, adminEmail) => {
  const sg =
    (await provider) !== "WalletConnect"
      ? await config(round.contract)
      : await walletConnect(round.contract);
  const stage = await MethodGetStage(sg.methods);

  const roundData = {
    stage,
    roundKey: round.id,
    toRegister: true,
    fromInvitation: true,
    fromEmail: adminEmail,
  };

  return roundData;
};

export const getUserAdminEmail = async (idUserAdmin) => {
  const { data } = await supabase
    .from("profiles")
    .select()
    .eq("id", idUserAdmin);

  return data[0].email;
};

export const getInviteByEmail = async ({ email }) => {
  const filterByEmail = email;
  const filterbyIsRegister = false;

  let query = supabase.from("invitationsByRound").select();
  if (filterByEmail) {
    query = query.eq("userEmail", filterByEmail);
  }
  query = query.eq("isRegister", filterbyIsRegister);

  const { data } = await query;
  return data;
};

export const getRoundInvite = async (invite) => {
  const { data } = await supabase
    .from("rounds")
    .select()
    .eq("id", invite.idRound);
  return data[0];
};

export default getInviteByEmail;
