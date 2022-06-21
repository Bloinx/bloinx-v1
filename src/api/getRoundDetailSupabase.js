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
    .match("idRound", idRound, "idUser", userId);
  console.log(data);
  return data;
};

const getPositionUserByAddress = async (user, roundId) => {
  const { data, error } = await supabase
    .from("positionByRound")
    .select()
    .eq("idRound", roundId);

  const roundData =
    data.find((position) => position.wallet === user.address.toLowerCase()) ||
    [];

  return roundData;
};

const getRoundDetail = async (roundId, currentProvider) => {
  const { data } = await supabase.from("rounds").select().eq("id", roundId);
  const { contract, userAdmin, ...other } = data[0];
  console.log(contract);

  const positionData = await getPositionUser(roundId, data[0].userAdmin);
  console.log(positionData);
  const sg =
    (await currentProvider) !== "WalletConnect"
      ? await config(data[0].contract)
      : await walletConnect(data[0].contract);

  // const sg = await config(contract);
  const admin = await MethodGetAdmin(sg.methods);
  const orderList = await MethodGetAddressOrderList(sg.methods);
  const stage = await MethodGetStage(sg.methods);
  const startTime = await MethodGetStartTime(sg.methods);
  const payTime = await MethodGetPayTime(sg.methods);
  console.log(orderList);
  const participantsData = orderList.map((user) => {
    const roundData = getPositionUserByAddress(user, roundId);

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
  console.log(participantsData);

  const a = {
    ...other,
    stage,
    contract,
    userAdmin,
    positionData,
    participantsData,
  };
  return a;
};

export default getRoundDetail;
