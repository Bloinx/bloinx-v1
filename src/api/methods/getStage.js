import { stages } from "../constants";

const getStage = (methods) => {
  return new Promise((resolve) => {
    methods
      .stage()
      .call()
      .then((stage) => {
        resolve(stages[stage]);
      })
      .catch((error) => {
        console.log(error, "error getStage");
      });
  });
};

export default getStage;
