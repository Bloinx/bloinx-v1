/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ConfigProvider } from "antd";
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
import Payment from "./containers/PaymentDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Switch>
      <ConfigProvider
        theme={{
          token: {
            colorSuccess: "#F58F98",
            colorPrimary: "#F58F98",
            colorLink: "#F58F98",
            fontFamily: "Open Sans",
          },
        }}
      >
        <ProvideAuth>
          <Route exact path="/login" component={Login} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/forgotpass" component={ForgotPass} />
          <Route exact path="/update-password" component={UpdatePass} />

          <Markup>
            <ProvideRound>
              <ProtectedRoute exact path="/dashboard" component={Dashboard} />
              <ProtectedRoute exact path="/history" component={History} />
              <ProtectedRoute path="/create-round" component={CreateBatch} />
              <ProtectedRoute path="/invitations" component={Invitations} />
              <ProtectedRoute path="/register-user" component={RegisterUser} />
              <ProtectedRoute path="/round-details" component={RoundDetails} />
              <ProtectedRoute path="/payment" component={Payment} />
            </ProvideRound>

            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
          </Markup>
        </ProvideAuth>
      </ConfigProvider>
    </Switch>
  );
}

export default App;
