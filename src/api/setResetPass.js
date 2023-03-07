import supabase from "../supabase";

const ResetPass = async ({ emailReset, onSuccess, onFailure }) => {
  const currentDomain =
    process.env.NODE_ENV === "production"
      ? `https://${process.env.VERCEL_URL}`
      : `http://${window.location.hostname}:3000`;

  const redirectToEmail = `${currentDomain}/update-password`;

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
