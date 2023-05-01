/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import Terms from "./Terms";
import Form from "./Form";
import Receipt from "./Receipt";
import { getUrlParams } from "../../utils/browser";
import APIgetRoundRegisterDetail from "../../api/getRoundRegisterDetailSupabase";

import { INITIAL_FORM_VALUES } from "./constants";
import { MainContext } from "../../providers/provider";

function RegisterUser() {
  const history = useHistory();
  const baseUrl = "/register-user";
  const { roundId } = getUrlParams(history.location.search);

  const [form, setForm] = useState(INITIAL_FORM_VALUES);
  const [roundData, setRoundData] = useState({});
  const { currentAddress, wallet, currentProvider } = useContext(MainContext);

  useEffect(() => {
    APIgetRoundRegisterDetail(roundId, wallet, currentProvider).then(
      (dataRound) => {
        setRoundData(dataRound);
      }
    );
  }, []);

  return (
    <Switch>
      <Route
        exact
        path={baseUrl}
        component={() => (
          <Terms
            form={form}
            setForm={setForm}
            roundData={roundData}
            walletAddress={currentAddress}
            baseUrl={baseUrl}
            wallet={wallet}
            chainId={currentProvider}
          />
        )}
      />
      <Route
        path={`${baseUrl}/join`}
        component={() => (
          <Form
            form={form}
            setForm={setForm}
            roundData={roundData}
            walletAddress={currentAddress}
            wallet={wallet}
          />
        )}
      />
      <Route path={`${baseUrl}/success`} component={() => <Receipt />} />
    </Switch>
  );
}

export default RegisterUser;
