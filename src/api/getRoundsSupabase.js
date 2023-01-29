import supabase from "../supabase";
import config, { walletConnect } from "./config.sg.web3";

import MethodGetAddressOrderList from "./methods/getAddressOrderList";
import MethodGetGroupSize from "./methods/getGroupSize";
import MethodGetStage from "./methods/getStage";
import MethodGetTurn from "./methods/getTurn";
import MethodGetRealTurn from "./methods/getRealTurn";
import MethodGetUserAvailableSavings from "./methods/getUserAvailableSavings";
import MethodGetUserAmountPaid from "./methods/getUserAmountPaid";
import MethodGetObligationAtTime from "./methods/getObligationAtTime";
import MethodGetUserUnassignedPayments from "./methods/getUserUnassignedPayments";
import MethodGetUserAvailableCashIn from "./methods/getUserAvailableCashIn";
import MethodGetSaveAmount from "./methods/saveAmount";
import MethodGetCashIn from "./methods/getCashIn";
import MethodGetAdmin from "./methods/getAdmin";

const getRounds = async ({ userId }) => {
  try {
    const { data } = await supabase
      .from("rounds")
      .select()
      .eq("userAdmin", userId);
    // console.log(userId, "getRounds");
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error, "error");
    return [];
  }
};

export const configByPosition = async (round, data, walletAddress, wallet) => {
  const sg =
    (await wallet) !== "WalletConnect"
      ? await config(round?.contract)
      : await walletConnect(round?.contract);

  const admin = await MethodGetAdmin(sg.methods);
  const orderList = await MethodGetAddressOrderList(sg.methods);
  const groupSize = await MethodGetGroupSize(sg.methods);
  const stage = await MethodGetStage(sg.methods);
  const turn = await MethodGetTurn(sg.methods);
  const cashIn = await MethodGetCashIn(sg.methods);
  const saveAmount = await MethodGetSaveAmount(sg.methods);
  const savings = await MethodGetUserAvailableSavings(
    sg.methods,
    data?.position || 1
  );

  const available = orderList.filter(
    (item) => item.address === "0x0000000000000000000000000000000000000000"
  );
  const exist =
    walletAddress &&
    orderList.find(
      (item) => item.address.toLowerCase() === walletAddress.toLowerCase()
    );

  let realTurn = "0";
  if (stage === "ON_ROUND_ACTIVE") {
    realTurn = await MethodGetRealTurn(sg.methods);
  }

  let paymentStatus;
  // let amount;
  if (data?.position) {
    // Todos los pagos que ya se han asignado, por un pago real o por la toma del cash in.
    const amountPaid = await MethodGetUserAmountPaid(sg.methods, data.position);
    const obligationAtTime = await MethodGetObligationAtTime(
      sg.methods,
      walletAddress
    );
    const unassignedPayments = await MethodGetUserUnassignedPayments(
      sg.methods,
      data.position
    );
    const availableCashIn = await MethodGetUserAvailableCashIn(
      sg.methods,
      data.position
    );
    const turnosPagadas =
      (Number(amountPaid) +
        Number(unassignedPayments) -
        (Number(cashIn) - Number(availableCashIn))) /
      Number(saveAmount);

    const ads = () => {
      if (turnosPagadas === groupSize - 1) {
        return "payments_done";
      }
      if (turnosPagadas === Number(obligationAtTime) / Number(saveAmount)) {
        return "payments_on_time";
      }
      if (turnosPagadas > Number(obligationAtTime) / Number(saveAmount)) {
        return "payments_advanced";
      }
      if (turnosPagadas < Number(obligationAtTime) / Number(saveAmount)) {
        return "payments_late";
      }
      return null;
    };

    // amount = turnosPagadas - Number(obligationAtTime);
    paymentStatus = ads();
  }

  const roundData = {
    contract: round?.contract,
    paymentStatus,
    // amount,
    name: data?.alias,
    roundKey: round?.id,
    toRegister: Boolean(!exist),
    groupSize,
    missingPositions: available.length,
    stage,
    turn,
    isAdmin:
      walletAddress === data?.wallet && walletAddress === admin.toLowerCase(),
    positionToWithdrawPay: data?.position,
    realTurn,
    withdraw:
      (Number(realTurn) > data?.position && Number(savings) > 0) ||
      (Number(groupSize) === data?.position && realTurn > Number(groupSize)),
    fromInvitation: false,
    saveAmount: (Number(cashIn) * 10 ** -18).toFixed(2),
  };
  console.log(realTurn, data?.position, groupSize);
  return roundData;
};

// export const getAll = async (userId, round) => {
//   try {
//     const { data, error } = await supabase
//       .from("positionByRound")
//       .select()
//       .eq("idUser", userId);
//       console.log(error);
//     return data[0];
//   } catch {
//     return [];
//   }
// };
export const getAll = async (userId, round) => {
  // const { data } = await supabase
  //   .from("positionByRound")
  //   .select("idUser, idRound")
  //   .match({ idUser: userId, idRound: round?.id });

  const { data } = await supabase
    .from("positionByRound")
    .select()
    .eq("idUser", userId)
    .eq("idRound", round?.id);
  return data[0];
};

export default getRounds;
