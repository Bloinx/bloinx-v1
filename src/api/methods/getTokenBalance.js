const getTokenBalance = (methods, walletAddress) =>
  new Promise((resolve) => {
    console.log(walletAddress);
    methods
      .balanceOf(walletAddress)
      .call()
      .then((balance) => {
        console.log(balance);
        resolve(balance);
      });
  });

export default getTokenBalance;
