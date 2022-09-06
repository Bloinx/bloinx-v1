// import axios from "axios";

const getUserScore = async (user) => {
  try {
    console.log(user);
    // if (user) {
    //   const { data } = await axios.get("http://localhost:3001/score");
    //   const { score } = data;
    //   console.log("Score ", score);
    // }
    return "Soon...";
  } catch (error) {
    console.log("Score Error ", error);
    return error;
  }
};

export default getUserScore;
