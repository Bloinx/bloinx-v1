import React, { useState, useEffect, useContext, createContext } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import supabase from "../supabase";
import signIn from "../api/setLoginSupabase";
import signUp from "../api/setSignUpSupabase";
import Logout from "../api/setLogoutSupabase";
import ResetPass from "../api/setResetPass";
import updatePassword from "../api/setUpdatePass";

const authContext = createContext();

export const useAuth = () => {
  return useContext(authContext);
};

const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const history = useHistory();

  useEffect(() => {
    const currentSession = supabase.auth.session();

    setUser(currentSession?.user ?? null);
    setLoading(false);

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session !== null) {
          setUser(session?.user ?? null);
          setLoading(false);
        } else {
          setUser(null);
          history.push("/logout");
        }
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, [history]);

  return {
    user,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    Logout,
    ResetPass,
    updatePassword,
  };
};

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {!auth.loading && children}
    </authContext.Provider>
  );
}
ProvideAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
