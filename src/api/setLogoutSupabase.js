import { useHistory } from "react-router-dom";
import supabase from "../supabase";

const Logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
  }
  useHistory("/login");
};

export default Logout;
