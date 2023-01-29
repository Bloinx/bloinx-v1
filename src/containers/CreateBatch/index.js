/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import Form from "./Form";
import Receipt from "./Receipt";
import Status from "./Status";

import { INITIAL_FORM_VALUES } from "./constants";
import { getTokenId, getTokenData } from "../../api/utils/getTokenData";

function CreateRound() {
  const history = useHistory();
  const baseUrl = "/create-round";
  // const chainIdLogin = JSON.parse(
  //   localStorage.getItem("user_address")
  // )?.chainId;
  const [values, _setValues] = React.useState(() =>
    JSON.parse(localStorage.getItem("user_address"))
  );
  console.log("values", values);
  const [tokenSelected, setTokenSelected] = React.useState(
    `${values?.chainId === 137 || values?.chainId === 80001 ? "USDC" : "cUSD"}`
  );

  useEffect(() => {
    if (values?.chainId === undefined) {
      history.push("/dashboard");
    } else {
      console.log("chainId", values?.chainId);
      getTokenId(values?.chainId);
      setTokenSelected(
        `${
          values?.chainId === 137 || values?.chainId === 80001 ? "USDC" : "cUSD"
        }`
      );
    }
  }, [values]);

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
            chainId={values?.chainId}
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
