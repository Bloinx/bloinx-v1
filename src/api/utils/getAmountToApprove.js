export const getAmountToApprove = (amount, groupsize, turn) => {
  return amount * (groupsize - turn + 1);
};

export const getAmountToApproveWithDecimals = (
  amount,
  groupsize,
  turn,
  decimals
) => {
  return (amount * (groupsize - turn + 1))
    .toFixed(decimals)
    .replace(".", "")
    .toString();
};
