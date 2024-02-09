import supabase from "../supabase";
import config, { walletConnect } from "./config.sg.web3";

import { configercToken } from "./config.erc";

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
import MethodGetFuturePayments from "./methods/getFuturePayments";
import { getTokenDecimals, getTokenAddressById } from "./utils/getTokenData";
import getAllowance from "./methods/getAllowance";
import {
  getFormattedAllowance,
  getFuturePaymentsFormatted,
} from "../utils/format";

const getRounds = async ({ userId }) => {
  try {
    const { data } = await supabase
      .from("rounds")
      .select()
      .eq("userAdmin", userId);

    return data;
  } catch (error) {
    console.log(error, "error");
    return [];
  }
};

export const configByPosition = async (
  round,
  data,
  walletAddress,
  walletProvider,
  currentProvider
) => {
  const sg =
    walletProvider !== "WalletConnect"
      ? await config(round?.contract, currentProvider)
      : await walletConnect(round?.contract);

  const token = await getTokenAddressById(round?.tokenId);
  const ercMethodsToken = await new Promise((resolve, reject) => {
    try {
      if (walletProvider !== "WalletConnect") {
        resolve(configercToken(token, currentProvider));
      }
    } catch (error) {
      reject(error);
    }
  });

  const allowance = await getAllowance(
    ercMethodsToken.methods,
    round?.contract,
    walletAddress
  );

  const futurePayments = await MethodGetFuturePayments(
    sg.methods,
    walletAddress
  );

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
  const tokenDecimals = await getTokenDecimals(round?.tokenId);

  const resultFuturePayments = getFuturePaymentsFormatted(
    futurePayments,
    tokenDecimals
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
    saveAmount: (Number(cashIn) * 10 ** -tokenDecimals).toFixed(2),
    tokenId: round?.tokenId,
    allowance: getFormattedAllowance(allowance),
    futurePayments: resultFuturePayments,
    sgMethods: sg.methods,
  };

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
  const { data } = await supabase
    .from("positionByRound")
    .select()
    .eq("idUser", userId)
    .eq("idRound", round?.id);
  return data[0];
};

export default getRounds;
