const getTokenBalance = (methods, walletAddress) =>
  new Promise((resolve) => {
    methods
      .balanceOf(walletAddress)
      .call()
      .then((balance) => {
        resolve(balance);
      });
  });

export default getTokenBalance;
