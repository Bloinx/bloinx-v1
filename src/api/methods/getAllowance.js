const getAllowance = (methods, contractSpender, walletAddress) =>
  new Promise((resolve) => {
    methods
      .allowance(walletAddress, contractSpender)
      .call()
      .then((amount) => {
        resolve(amount);
      });
  });

export default getAllowance;
