import supabase from "../supabase";

const signUp = async ({ values, onSuccess, onFailure }) => {
  try {
    const { user, session, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });
    if (error) throw error;
    if (session) {
      onSuccess(user);
    }
  } catch (e) {
    // alert(e.message);
    onFailure(e.message);
  }
};

export default signUp;
