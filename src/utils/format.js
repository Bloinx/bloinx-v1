import Decimal from "decimal.js";
import web3 from "web3";

export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function formatAddress(originalAddress) {
  if (!originalAddress) {
    return "";
  }

  const firstPart = `${originalAddress.substring(0, 2)}${originalAddress
    .substring(2, 6)
    .toUpperCase()}`;
  const secondPart = `${originalAddress
    .substring(originalAddress.length - 4, originalAddress.length)
    .toUpperCase()}`;
  return `${firstPart}...${secondPart}`;
}

export default {
  validateEmail,
  formatAddress,
};

export function formatBalance(rawBalance, decimals) {
  const scaleFactor = new Decimal(10).pow(decimals.toNumber());
  return new Decimal(rawBalance.toString()).dividedBy(scaleFactor).toString();
}

export const getFormattedAllowance = (allowance) => {
  const allowanceBigNumber = web3.utils.toBN(allowance);
  const allowanceFormatted = web3.utils.fromWei(
    allowanceBigNumber.toString(),
    "ether"
  );
  return allowanceFormatted;
};

export const getFuturePaymentsFormatted = (futurePayments, tokenDecimals) => {
  const resultFuturePayments = (
    Number(futurePayments) *
    10 ** -tokenDecimals
  ).toFixed(2);
  return resultFuturePayments;
};
