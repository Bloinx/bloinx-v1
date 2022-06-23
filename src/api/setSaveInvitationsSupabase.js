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
  // const { data, error } = await supabase
  //   .from("positionByRound")
  //   .select()
  //   .eq("idRound", idRound)
  //   .eq("idUser", userAdminId);
  // if (error) console.log(error);
  // return data;

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
  console.log(data);
  return data[0];
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

const setSaveInvitations = async (mailList, round, provider, positionData) => {
  const sg =
    (await provider) !== "WalletConnect"
      ? await config(round?.contract)
      : await walletConnect(round?.contract);

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
                  name_tanda: positionData?.alias,
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
          console.log("hola");
          return true;
        })
        .catch((e) => {
          console.log(e);
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
  if (error) console.log(error);
  if (data) console.log(data);
  return data[0];
};

export const setAllInvites = (mailList, roundId, provider) => {
  debugger;
  return new Promise((resolve, reject) => {
    getRoundData(roundId).then((round) => {
      console.log(round);
      // setEmailInvite(mailList, round?.id);
      getPositionUserAdmin(round?.id, round?.userAdmin).then(
        (positionAdminData) => {
          console.log(positionAdminData);
          setSaveInvitations(mailList, round, provider, positionAdminData)
            .then((status) => {
              console.log(status);
              resolve(status);
              // return status;
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        }
      );
    });
  });
};

export default setAllInvites;
