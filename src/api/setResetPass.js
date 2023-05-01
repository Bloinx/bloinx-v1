import supabase from "../supabase";

const ResetPass = async ({ emailReset, onSuccess, onFailure }) => {
  // eslint-disable-next-line
  const hostname = window.location.hostname;
  const currentDomain = hostname.includes("localhost")
    ? `http://${hostname}:3000`
    : `https://${hostname}`;
  const redirectToEmail = `${currentDomain}/update-password`;
  const { data, error } = await supabase.auth.api.resetPasswordForEmail(
    emailReset,
    {
      redirectTo: redirectToEmail,
    }
  );
  onSuccess(data);
  onFailure(error);
};

export default ResetPass;
