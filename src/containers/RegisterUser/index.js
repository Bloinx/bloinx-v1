/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";

import Terms from "./Terms";
import Form from "./Form";
import Receipt from "./Receipt";
import { getUrlParams } from "../../utils/browser";
import APIgetRoundRegisterDetail from "../../api/getRoundRegisterDetailSupabase";

import { INITIAL_FORM_VALUES } from "./constants";
import { MainContext } from "../../providers/provider";

function RegisterUser({ provider }) {
  const history = useHistory();
  const baseUrl = "/register-user";
  const { roundId } = getUrlParams(history.location.search);

  const [form, setForm] = useState(INITIAL_FORM_VALUES);
  const [roundData, setRoundData] = useState({});
  const { currentAddress } = useContext(MainContext);

  useEffect(() => {
    APIgetRoundRegisterDetail(roundId, provider).then((dataRound) => {
      setRoundData(dataRound);
    });
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
            currentAddress={currentAddress}
            baseUrl={baseUrl}
            provider={provider}
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
            currentAddress={currentAddress}
            provider={provider}
          />
        )}
      />
      <Route path={`${baseUrl}/success`} component={() => <Receipt />} />
    </Switch>
  );
}

RegisterUser.defaultProps = {
  provider: null,
};

RegisterUser.propTypes = {
  provider: PropTypes.string,
};

const mapStateToProps = (state) => {
  const provider = state?.main?.currentProvider;
  return { provider };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterUser);
