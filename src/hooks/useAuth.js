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

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};
// Provider hook that creates auth object and handles state
const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  useEffect(() => {
    // Check active sessions and sets the user
    const currentSession = supabase.auth.session();

    setUser(currentSession?.user ?? null);
    setLoading(false);

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session !== null) {
          setUser(session?.user ?? null);
          setLoading(false);
        } else {
          history.push("/logout");
        }
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, []);
  // Return the user object and auth methods
  return {
    user,
    loading,
    signIn,
    signUp,
    Logout,
    ResetPass,
    updatePassword,
  };
};

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
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
