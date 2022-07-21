const getTokenBalance = (methods, { walletAddress }) =>
  new Promise((resolve) => {
    methods
      .balanceOf()
      .send({
        account: walletAddress,
      })
      .call()
      .then((balanceOf) => {
        resolve(balanceOf);
      });
  });

export default getTokenBalance;


