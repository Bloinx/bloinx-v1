/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import Form from "./Form";
import Receipt from "./Receipt";
import { getUrlParams } from "../../utils/browser";
import { MainContext } from "../../providers/provider";

function RegisterUser() {
  const history = useHistory();
  const baseUrl = "/invitations";
  const { roundId } = getUrlParams(history.location.search);
  const { wallet } = useContext(MainContext);

  return (
    <Switch>
      <Route
        path={baseUrl}
        component={() => (
          <Form
            roundId={roundId}
            wallet={wallet}
            // walletAddress={walletAddress}
          />
        )}
      />
      <Route path={`${baseUrl}/success`} component={() => <Receipt />} />
    </Switch>
  );
}

export default RegisterUser;
