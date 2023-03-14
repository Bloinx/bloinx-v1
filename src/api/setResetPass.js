import supabase from "../supabase";

const ResetPass = async ({ emailReset, onSuccess, onFailure }) => {
  const currentDomain =
    process.env.NODE_ENV !== "production"
      ? // ? `https://${process.env.VERCEL_URL}`
        `https://${process.env.REACT_APP_DOMAIN}`
      : `http://${window.location.hostname}:3000`;

  const redirectToEmail = `${currentDomain}/update-password`;
  console.log(`https://${process.env.VERCEL_URL} vercel-url`);
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
