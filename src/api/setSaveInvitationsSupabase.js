/* eslint-disable no-unused-vars */
import axios from "axios";
import Web3 from "web3";

import supabase from "../supabase";
import config, { walletConnect } from "./config.sg.web3";

import MethodGetGroupSize from "./methods/getGroupSize";
import MethodGetPayTime from "./methods/getPayTime";
import MethodSaveAmount from "./methods/saveAmount";

const dayInSeconds = 86400;

const getPositionUserAdmin = async (idRound, userAdminId) => {
  const { data, error } = await supabase
    .from("positionByRound")
    .select()
    .eq("idRound", idRound)
    .eq("idUser", userAdminId);
  if (error) console.log(error);
  return data;
};

const setEmailInvite = (mailList, roundId) => {
  mailList.forEach(async (mail) => {
    const { data, error } = await supabase
      .from("invitationsByRound")
      .insert([{ idRound: roundId, userEmail: mail, isRegister: false }]);
    if (error) console.log(error);
    if (data) console.log(data);
  });
};

const setSaveInvitations = async (mailList, roundId, provider) => {
  const { data, error } = await supabase
    .from("rounds")
    .select()
    .eq("idRound", roundId);
  if (error) console.log(error);

  setEmailInvite(mailList, roundId);

  const positionData = await getPositionUserAdmin(data.userAdmin);
  // data.positions.find((position) => position.userId === data.userAdmin) || {};

  const sg = await new Promise((resolve, reject) => {
    try {
      if (provider !== "WalletConnect") {
        resolve(config(data.contract));
      } else {
        resolve(walletConnect(data.contract));
      }
    } catch (e) {
      reject(e);
    }
  });

  const groupSize = await MethodGetGroupSize(sg.methods);
  const payTime = await MethodGetPayTime(sg.methods);
  const saveAmount = await MethodSaveAmount(sg.methods);
  const longevity = (payTime / dayInSeconds) * groupSize;
  const totalAmount =
    Number(Web3.utils.fromWei(saveAmount)) * Number(groupSize);

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
                  name_tanda: positionData.alias,
                  // type: "Public/Private",
                  longevity: `${longevity} días`,
                  participant: `${groupSize - 1}`,
                  amount: `${totalAmount} cUSD`,
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
  } catch (err) {
    return false;
  }
  return null;
};

export default setSaveInvitations;
