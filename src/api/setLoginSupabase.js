import supabase from "../supabase";

const login = async ({ userLogin, password, onSuccess, onFailure }) => {
  try {
    const { user, session, error } = await supabase.auth.signIn({
      email: userLogin,
      password,
    });
    if (error) throw error;
    if (session) {
      onSuccess(user);
    }
  } catch (e) {
    onFailure(e.message);
  }
};

export default login;
