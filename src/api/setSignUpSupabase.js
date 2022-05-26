import supabase from "../supabase";

const signUp = async ({ userEmail, password, onSuccess, onFailure }) => {
  try {
    const { user, session, error } = await supabase.auth.signUp({
      email: userEmail,
      password,
    });
    if (error) throw error;
    if (session) {
      onSuccess(user);
      console.log(user);
    }
  } catch (e) {
    alert(e.message);
    onFailure(e.message);
  }
};

export default signUp;
