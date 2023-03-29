import supabase from "../supabase";

const ResetPass = async ({ emailReset, onSuccess, onFailure }) => {
  // eslint-disable-next-line
  const hostname = window.location.hostname;
  console.log(hostname);
  const currentDomain = hostname.includes("localhost")
    ? `http://${hostname}:3000`
    : `https://${hostname}`;
  const redirectToEmail = `${currentDomain}/update-password`;
  console.log("Redirect to:", redirectToEmail);
  const { data, error } = await supabase.auth.api.resetPasswordForEmail(
    emailReset,
    {
      redirectTo: redirectToEmail,
    }
  );
  onSuccess(data);
  console.log("Password reset email sent successfully:", data);
  console.log("Request headers:", error.response.headers);
  onFailure(error);
};

export default ResetPass;
