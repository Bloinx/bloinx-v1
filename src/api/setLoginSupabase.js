import supabase from "../supabase";

const login = async ({ userLogin, password, onSuccess, onFailure }) => {
  const { user, session, error } = await supabase.auth.signIn({
    email: userLogin,
    password,
  });
  if (user) {
    onSuccess(session);
    console.log(session);
  }
  if (error) {
    onFailure(error);
  }
};

export default login;
