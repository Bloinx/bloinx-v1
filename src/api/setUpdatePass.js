import supabase from "../supabase";

const updatePassword = async ({
  values,
  accessToken,
  onSuccess,
  onFailure,
}) => {
  try {
    const { error } = await supabase.auth.api.updateUser(accessToken, {
      password: values.password,
    });
    if (error) {
      throw error;
    } else if (!error) {
      onSuccess();
    }
  } catch (e) {
    // alert(e.message);
    onFailure(e.message);
  }
};

export default updatePassword;
