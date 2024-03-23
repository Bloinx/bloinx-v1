/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import Terms from "./Terms";
import Form from "./Form";
import { getUrlParams } from "../../utils/browser";
import APIgetRoundRegisterDetail from "../../api/getRoundRegisterDetailSupabase";

import { INITIAL_FORM_VALUES } from "./constants";
import { MainContext } from "../../providers/provider";
import { useRoundContext } from "../../contexts/RoundsContext";
import Loader from "../../components/Loader";

function RegisterUser() {
  const history = useHistory();
  const baseUrl = "/register-user";
  const { roundId } = getUrlParams(history.location.search);

  const [form, setForm] = useState(INITIAL_FORM_VALUES);
  const [roundData, setRoundData] = useState();
  const { currentAddress, wallet, currentProvider, funds } =
    useContext(MainContext);
  // const [tokenBalance, setTokenBalance] = useState();

  const { handleGetRounds } = useRoundContext();

  useEffect(() => {
    APIgetRoundRegisterDetail(roundId, wallet, currentProvider).then(
      (dataRound) => {
        setRoundData(dataRound);
      }
    );
  }, [roundId, wallet, currentProvider]);

  if (roundData === undefined) {
    return <Loader loadingMessage="infoLoader.roundPage" />;
  }

  return (
    <Switch>
      <Route
        exact
        path={baseUrl}
        component={() => (
          <Terms
            form={form}
            baseUrl={baseUrl}
            walletAddress={currentAddress}
            roundData={roundData}
            wallet={wallet}
            chainId={currentProvider}
            funds={funds}
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
            currentProvider={currentProvider}
            handleGetRounds={handleGetRounds}
          />
        )}
      />
      {/* <Route
        path={`${baseUrl}/success`}
        component={() => (
          <Receipt
            walletAddress={currentAddress}
            wallet={wallet}
            currentProvider={currentProvider}
            handleGetRounds={handleGetRounds}
          />
        )}
      /> */}
    </Switch>
  );
}

export default RegisterUser;
