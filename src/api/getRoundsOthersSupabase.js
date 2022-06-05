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

const getRounds = async ({ userId, walletAddress, provider }) => {
  const configByPosition = async (positionByRound) => {
    const { data, error } = await supabase
      .from("rounds")
      .select()
      .eq("id", positionByRound.idRound)
      .neq("userAdmin", userId);

    if (error || data === undefined) {
      console.log("Round - is Admin");
      return [];
    }

    const sg =
      (await provider) !== "WalletConnect"
        ? await config(data.contract)
        : await walletConnect(data.contract);

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
    let amount;

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
        if (pagos === Number(obligationAtTime) / Number(saveAmount)) {
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

      amount = pagos - Number(obligationAtTime);
      paymentStatus = ads();
    }

    const roundData = {
      paymentStatus,
      amount,
      name: positionByRound.alias,
      roundKey: positionByRound.idRound,
      toRegister: Boolean(!exist),
      groupSize,
      missingPositions: available.length,
      stage,
      turn,
      isAdmin:
        walletAddress === data.wallet && walletAddress === admin.toLowerCase(),
      positionToWithdrawPay: positionByRound.position,
      realTurn,
      withdraw:
        Number(realTurn) > positionByRound.position && Number(savings) > 0,
      fromInvitation: false,
    };

    return roundData;
  };

  const { data } = await supabase
    .from("positionByRound")
    .select()
    .eq("idUser", userId);

  return new Promise((resolve) => {
    const rounds = [];
    data.map(async (positionByRound) => {
      const roundData = await configByPosition(positionByRound);
      if (roundData !== []) {
        rounds.push(roundData);
      }
    });
    resolve(rounds.sort());
  });
};

export default getRounds;
