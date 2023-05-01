/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import Form from "./Form";
import Receipt from "./Receipt";
import Status from "./Status";

import { INITIAL_FORM_VALUES } from "./constants";
import { getTokenId, getTokenData } from "../../api/utils/getTokenData";
import { MainContext } from "../../providers/provider";

function CreateRound() {
  const history = useHistory();
  const baseUrl = "/create-round";
  const { currentProvider } = useContext(MainContext);

  const [tokenSelected, setTokenSelected] = React.useState(
    `${currentProvider === 137 || currentProvider === 80001 ? "USDC" : "cUSD"}`
  );

  useEffect(() => {
    if (currentProvider === undefined) {
      history.push("/dashboard");
    } else {
      getTokenId(currentProvider);
      setTokenSelected(
        `${
          currentProvider === 137 || currentProvider === 80001 ? "USDC" : "cUSD"
        }`
      );
    }
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
            chainId={currentProvider}
            setTokenSelected={setTokenSelected}
            tokenSelected={tokenSelected}
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
