import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();
  return (
    <Route
      {...rest} // eslint-disable-line react/jsx-props-no-spreading
      render={(props) => {
        if (isAuthenticated) {
          return <Component {...props} />; // eslint-disable-line react/jsx-props-no-spreading
        }
        return (
          <Redirect to={{ pathname: "/login", state: { from: props.path } }} />
        );
      }}
    />
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  path: PropTypes.string.isRequired,
};

export default ProtectedRoute;
