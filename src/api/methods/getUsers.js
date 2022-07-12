/* eslint-disable no-unused-vars */
const getUsers = (methods, contract) =>
  new Promise((resolve) => {
    methods
      .getUserAvailableSavings()
      .call()
      .then((users) => {
        resolve(users);
      });
  });

export default getUsers;
