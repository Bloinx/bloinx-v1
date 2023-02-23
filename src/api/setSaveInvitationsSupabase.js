/* eslint-disable no-unused-vars */
import axios from "axios";

import supabase from "../supabase";
import config, { walletConnect } from "./config.sg.web3";

import MethodGetGroupSize from "./methods/getGroupSize";
import MethodGetPayTime from "./methods/getPayTime";
import MethodSaveAmount from "./methods/saveAmount";
import { getTokenDecimals, getTokenSymbolByRound } from "./utils/getTokenData";

const dayInSeconds = 86400;

const getPositionUserAdmin = async (idRound, userAdminId) => {
  const filterByUserId = userAdminId;
  const filterbyRound = idRound;

  let query = supabase.from("positionByRound").select();

  if (filterbyRound) {
    query = query.eq("idRound", filterbyRound);
  }
  if (filterByUserId) {
    query = query.eq("idUser", filterByUserId);
  }

  const { data } = await query;

  return data[0];
};

const setEmailInvite = (mailList, roundId) => {
  mailList.forEach(async (mail) => {
    const { data, error } = await supabase
      .from("invitationsByRound")
      .insert([{ idRound: roundId, userEmail: mail, isRegister: false }]);
  });
};

const setSaveInvitations = async (mailList, round, wallet, positionData) => {
  const sg =
    (await wallet) !== "WalletConnect"
      ? await config(round?.contract)
      : await walletConnect(round?.contract);

  const groupSize = await MethodGetGroupSize(sg.methods);
  const payTime = await MethodGetPayTime(sg.methods);
  const saveAmount = await MethodSaveAmount(sg.methods);
  const tokenSymbol = await getTokenSymbolByRound(round.tokenId);
  const decimals = await getTokenDecimals(round.tokenId);
  const longevity = (payTime / dayInSeconds) * groupSize;

  const totalAmount = Number(saveAmount * 10 ** -decimals) * Number(groupSize);
  try {
    await mailList.forEach((mail) => {
      axios
        .post(
          "https://wtb2taazv8.execute-api.us-east-2.amazonaws.com/mandarMail/sendMail",
          {
            personalizations: [
              {
                to: [
                  {
                    email: mail,
                  },
                ],
                dynamic_template_data: {
                  user: mail,
                  title: "Inviación a la Ronda",
                  link: "https://bloinx.app/login",
                  name: "Bloinx Team",
                  name_tanda: positionData?.alias,
                  // type: "Public/Private",
                  longevity: `${longevity} días`,
                  participant: `${groupSize - 1}`,
                  amount: `${totalAmount} ${tokenSymbol}`,
                },
                subject: "Inviación a la Ronda",
              },
            ],
          }
        )
        .then(() => {
          return true;
        })
        .catch((e) => {
          return false;
        });
    });
  } catch (error) {
    return false;
  }
  return true;
};

export const getRoundData = async (roundId) => {
  const { data, error } = await supabase
    .from("rounds")
    .select()
    .eq("id", roundId);

  return data[0];
};

export const setAllInvites = (mailList, roundId, wallet) => {
  return new Promise((resolve, reject) => {
    getRoundData(roundId).then((round) => {
      setEmailInvite(mailList, round?.id);
      getPositionUserAdmin(round?.id, round?.userAdmin).then(
        (positionAdminData) => {
          setSaveInvitations(mailList, round, wallet, positionAdminData)
            .then((status) => {
              resolve(status);
              // return status;
            })
            .catch((err) => {
              reject(err);
            });
        }
      );
    });
  });
};

export default setAllInvites;
