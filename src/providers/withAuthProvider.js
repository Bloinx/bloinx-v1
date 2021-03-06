/* eslint-disable react/jsx-props-no-spreading */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import supabase from "../supabase";

function WithAuthProvider(WrappedComponent) {
  const Auth = ({ saveUser, user, ...other }) => {
    const history = useHistory();

    useEffect(() => {
      if (!user.uid) {
        try {
          const userSession = supabase.auth.user();

          if (userSession) {
            saveUser(userSession);
          } else {
            history.push("/logout");
          }
        } catch (e) {
          history.push("/logout");
        }
      }
    }, []);

    return <WrappedComponent {...other} />;
  };

  const mapStateToProps = (state) => state;

  const mapDispatchToProps = (dispatch) => ({
    saveUser: (userData) =>
      dispatch({
        type: "SAVE_USER_DATA",
        payload: userData,
      }),
  });

  Auth.propTypes = {
    saveUser: PropTypes.func.isRequired,
    user: PropTypes.instanceOf(Object).isRequired,
  };
  return connect(mapStateToProps, mapDispatchToProps)(Auth);
}

export default WithAuthProvider;
