/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Login from "./containers/Login";
import Logout from "./containers/Logout";
import SignUp from "./containers/Signup";
import Markup from "./containers/Markup";
import Dashboard from "./containers/Dashboard";
import History from "./containers/History";
import CreateBatch from "./containers/CreateBatch";
// import RegisterPay from "./containers/RegisterPay";
import RegisterUser from "./containers/RegisterUser";
import RoundDetails from "./containers/RoundDetails";
import Invitations from "./containers/Invitations";
import { ProvideRound } from "./contexts/RoundsContext";
import "./App.scss";
import { ProvideAuth } from "./hooks/useAuth";
import ForgotPass from "./containers/ForgotPass";
import UpdatePass from "./containers/UpdatePass";

function App() {
  return (
    <Switch>
      <ProvideAuth>
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/forgotpass" component={ForgotPass} />
        <Route exact path="/update-password" component={UpdatePass} />

        <Markup>
          <ProvideRound>
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/history" component={History} />
            <Route path="/create-round" component={CreateBatch} />
            <Route path="/invitations" component={Invitations} />
            <Route path="/register-user" component={RegisterUser} />
            <Route path="/round-details" component={RoundDetails} />
          </ProvideRound>

          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </Markup>
      </ProvideAuth>
    </Switch>
  );
}

export default App;
