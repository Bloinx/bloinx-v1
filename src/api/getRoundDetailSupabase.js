/* eslint-disable no-unused-vars */
import moment from "moment";
import supabase from "../supabase";
import MethodGetAddressOrderList from "./methods/getAddressOrderList";
import MethodGetAdmin from "./methods/getAdmin";
import MethodGetStage from "./methods/getStage";
import MethodGetPayTime from "./methods/getPayTime";
import MethodGetStartTime from "./methods/getStartTime";
import config, { walletConnect } from "./config.sg.web3";

const getPositionUser = async (idRound, userId) => {
  const { data, error } = await supabase
    .from("positionByRound")
    .select()
    .eq("idRound", idRound)
    .neq("idUser", userId);

  return data;
};

const getPositionUserByAddress = async (user) => {
  const { data, error } = await supabase.from("positionByRound").select();

  const roundData =
    data.find((position) => position.wallet === user.address.toLowerCase()) ||
    [];

  return roundData;
};

const getRoundDetail = async (roundId, currentProvider) => {
  try {
    const { data } = await supabase
      .from("rounds")
      .select("id")
      .match({ id: roundId });

    const { contract, userAdmin, ...other } = data;

    const positionData = await getPositionUser(roundId, userAdmin);

    const sg = await new Promise((resolve, reject) => {
      try {
        if (currentProvider !== "WalletConnect") {
          resolve(config(contract));
        } else {
          resolve(walletConnect(contract));
        }
      } catch (error) {
        reject(error);
      }
    });

    // const sg = await config(contract);
    const admin = await MethodGetAdmin(sg.methods);
    const orderList = await MethodGetAddressOrderList(sg.methods);
    const stage = await MethodGetStage(sg.methods);
    const startTime = await MethodGetStartTime(sg.methods);
    const payTime = await MethodGetPayTime(sg.methods);

    const participantsData = orderList.map((user) => {
      const roundData = getPositionUserByAddress(user);

      return {
        ...user,
        address:
          user.address === "0x0000000000000000000000000000000000000000"
            ? null
            : user.address,
        userId: roundData.userAdmin,
        walletAddress: roundData.wallet,
        admin: admin === user.address,
        dateToWithdraw:
          startTime === "0"
            ? "---"
            : moment(
                new Date(
                  (Number(startTime) + user.position * payTime + 10) * 1000
                )
              ).format("DD - MMM - YYYY HH:mm"),
      };
    });
    const a = {
      ...other,
      stage,
      contract,
      userAdmin,
      positionData,
      participantsData,
    };
    return a;
  } catch (err) {
    return err;
  }
};

export default getRoundDetail;
