import supabase from "../supabase";
import config, { walletConnect } from "./config.sg.web3";
import { getTokenDecimals } from "./utils/getTokenData";

import MethodGetAddressOrderList from "./methods/getAddressOrderList";
import MethodGetGroupSize from "./methods/getGroupSize";
import MethodGetStage from "./methods/getStage";
import MethodGetTurn from "./methods/getTurn";
import MethodGetRealTurn from "./methods/getRealTurn";
import MethodGetUserAmountPaid from "./methods/getUserAmountPaid";
import MethodGetObligationAtTime from "./methods/getObligationAtTime";
import MethodGetUserUnassignedPayments from "./methods/getUserUnassignedPayments";
import MethodGetUserAvailableCashIn from "./methods/getUserAvailableCashIn";
import MethodGetSaveAmount from "./methods/saveAmount";
import MethodGetCashIn from "./methods/getCashIn";
import MethodGetAdmin from "./methods/getAdmin";

const getHistoryRounds = async ({ userId }) => {
  const { data } = await supabase
    .from("rounds")
    .select()
    .eq("userAdmin", userId);
  return data;
};

export const configByPosition = async (
  round,
  data,
  walletAddress,
  provider,
  currentProvider
) => {
  const sg =
    (await provider) !== "WalletConnect"
      ? await config(round?.contract, currentProvider)
      : await walletConnect(round?.contract);

  const admin = await MethodGetAdmin(sg.methods);
  const orderList = await MethodGetAddressOrderList(sg.methods);
  const groupSize = await MethodGetGroupSize(sg.methods);
  const stage = await MethodGetStage(sg.methods);
  const turn = await MethodGetTurn(sg.methods);
  const cashIn = await MethodGetCashIn(sg.methods);
  const saveAmount = await MethodGetSaveAmount(sg.methods);
  const tokenDecimals = await getTokenDecimals(round?.tokenId);

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
    withdraw: Number(realTurn) > data?.position,
    fromInvitation: false,
    saveAmount: (Number(cashIn) * 10 ** -tokenDecimals).toFixed(2),
  };

  return roundData;
};

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

export default getHistoryRounds;
