// import { useHistory } from "react-router-dom";
import supabase from "../supabase";

const ResetPass = async ({ emailReset, onSuccess, onFailure }) => {
  const { data, error } = await supabase.auth.api.resetPasswordForEmail(
    emailReset,
    { redirectTo: "http://localhost:3000/update-password" }
  );
  // console.log("Email sent successfully!");
  onSuccess(data);
  console.log(error.message);
  onFailure(error);
};

export default ResetPass;
