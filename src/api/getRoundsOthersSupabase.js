import config, { walletConnect } from "./config.sg.web3";
import supabase from "../supabase";
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
import { getTokenDecimals } from "./utils/getTokenData";

const getRounds = async ({ userId }) => {
  const { data } = await supabase
    .from("positionByRound")
    .select()
    .eq("idUser", userId);
  return data;
};

export const getAllOtherRounds = async (userId, positionByRound) => {
  const filterByUserId = userId;
  const filterbyRound = positionByRound.idRound;

  let query = supabase.from("rounds").select();

  if (filterbyRound) {
    query = query.eq("id", filterbyRound);
  }
  if (filterByUserId) {
    query = query.neq("userAdmin", filterByUserId);
  }

  const { data } = await query;
  return data[0];
};

export const configByPositionOther = async (
  round,
  positionByRound,
  walletAddress,
  wallet
) => {
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
    positionByRound.position || 1
  );
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
  //  let amount;

  if (positionByRound.position) {
    const amountPaid = await MethodGetUserAmountPaid(
      sg.methods,
      positionByRound.position
    );
    const obligationAtTime = await MethodGetObligationAtTime(
      sg.methods,
      walletAddress
    );
    const unassignedPayments = await MethodGetUserUnassignedPayments(
      sg.methods,
      positionByRound.position
    );
    const availableCashIn = await MethodGetUserAvailableCashIn(
      sg.methods,
      positionByRound.position
    );

    const pagos =
      (Number(amountPaid) +
        Number(unassignedPayments) -
        (Number(cashIn) - Number(availableCashIn))) /
      Number(saveAmount);

    const ads = () => {
      if (pagos === groupSize - 1) {
        return "payments_done";
      }
      if (pagos === Number(obligationAtTime) / Number(saveAmount)) {
        console.log("pagos a tiempo");
        return "payments_on_time";
      }
      if (pagos > Number(obligationAtTime) / Number(saveAmount)) {
        return "payments_advanced";
      }
      if (pagos < Number(obligationAtTime) / Number(saveAmount)) {
        return "payments_late";
      }
      return null;
    };

    // amount = pagos - Number(obligationAtTime);
    paymentStatus = ads();
  }

  const roundData = {
    contract: round?.contract,
    paymentStatus,
    saveAmount: (Number(cashIn) * 10 ** -tokenDecimals).toFixed(2),
    tokenId: round?.tokenId,
    name: positionByRound.alias,
    roundKey: positionByRound.idRound,
    toRegister: Boolean(!exist),
    groupSize,
    missingPositions: available.length,
    stage,
    turn,
    isAdmin:
      walletAddress === round?.wallet && walletAddress === admin.toLowerCase(),
    positionToWithdrawPay: positionByRound.position,
    realTurn,
    withdraw:
      (Number(realTurn) > positionByRound.position && Number(savings) > 0) ||
      (Number(groupSize) === positionByRound.position &&
        realTurn > Number(groupSize)),
    fromInvitation: false,
  };
  console.log(round?.contract, realTurn, positionByRound.position, groupSize);
  return roundData;
};

export default getRounds;
