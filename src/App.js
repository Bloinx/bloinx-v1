/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";

import Login from "./containers/Login";
import Logout from "./containers/Logout";
import SignUp from "./containers/Signup";
import Markup from "./containers/Markup";
import Dashboard from "./containers/Dashboard";
import History from "./containers/History";
import CreateBatch from "./containers/CreateBatch";
import RegisterPay from "./containers/RegisterPay";
import RegisterUser from "./containers/RegisterUser";
import RoundDetails from "./containers/RoundDetails";
import Invitations from "./containers/Invitations";
import { getInitialContractInstance } from "./redux/actions/main";
import { RoundsContext } from "./contexts/RoundsContext";
import "./App.scss";

function App({ initialContractInstance }) {
  const [roundList, setRoundList] = useState([]);

  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/logout" component={Logout} />
      <Route exact path="/signup" component={SignUp} />
      <Markup initialContractInstance={initialContractInstance}>
        <RoundsContext.Provider value={{ roundList, setRoundList }}>
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/history" component={History} />
        </RoundsContext.Provider>
        <Route path="/create-round" component={CreateBatch} />
        <Route path="/invitations" component={Invitations} />
        <Route path="/register-user" component={RegisterUser} />
        <Route exact path="/registerpay" component={RegisterPay} />
        <Route path="/round-details" component={RoundDetails} />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </Markup>
    </Switch>
  );
}

App.defaultProps = {
  initialContractInstance: () => {},
};

App.propTypes = {
  initialContractInstance: PropTypes.func,
};

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
  initialContractInstance: (instance) =>
    dispatch(getInitialContractInstance(instance)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
