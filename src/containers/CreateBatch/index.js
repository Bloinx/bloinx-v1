/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import Form from "./Form";
import Receipt from "./Receipt";
import Status from "./Status";

import { INITIAL_FORM_VALUES } from "./constants";
import { MainContext } from "../../providers/provider";
import useToken from "../../hooks/useToken";

function CreateRound() {
  const history = useHistory();
  const baseUrl = "/create-round";
  const { currentProvider } = useContext(MainContext);
  const { tokens } = useToken(currentProvider);

  const [tokenSelected, setTokenSelected] = React.useState(
    `${currentProvider === 137 || currentProvider === 80001 ? "USDC" : "cUSD"}`
  );

  useEffect(() => {
    setTokenSelected(
      `${
        currentProvider === 137 || currentProvider === 80001 ? "USDC" : "cUSD"
      }`
    );
  }, [currentProvider]);

  const [form, setForm] = useState(INITIAL_FORM_VALUES);

  return (
    <Switch>
      <Route
        exact
        path={baseUrl}
        component={() => (
          <Form
            form={form}
            setForm={setForm}
            setTokenSelected={setTokenSelected}
            tokenSelected={tokenSelected}
            tokens={tokens}
          />
        )}
      />
      <Route
        exact
        path={`${baseUrl}/confirm`}
        component={() => (
          <Receipt
            form={form}
            setForm={setForm}
            tokenSelected={tokenSelected}
          />
        )}
      />
      <Route
        exact
        path={`${baseUrl}/receipt/:status(success|error)`}
        component={() => <Status form={form} setForm={setForm} />}
      />
    </Switch>
  );
}

export default React.memo(CreateRound);
