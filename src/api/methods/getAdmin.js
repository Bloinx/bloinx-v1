const getAdmin = (methods) => {
  return new Promise((resolve) => {
    methods
      .admin()
      .call()
      .then((admin) => {
        resolve(admin);
      })
      .catch((error) => {
        console.log(error, "error getAdmin");
      });
  });
};
export default getAdmin;
