// import { useHistory } from "react-router-dom";
import supabase from "../supabase";

const ResetPass = async ({ emailReset, onSuccess, onFailure }) => {
  const currentDomain = window.location.hostname;
  const redirectToEmail =
    currentDomain === "localhost"
      ? "http://localhost:3000/update-password"
      : `https://${currentDomain}/update-password`;

  const { data, error } = await supabase.auth.api.resetPasswordForEmail(
    emailReset,
    {
      redirectTo: redirectToEmail,
    }
  );
  onSuccess(data);
  console.log(error.message);
  onFailure(error);
};

export default ResetPass;
