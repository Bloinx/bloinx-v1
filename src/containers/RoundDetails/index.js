import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import withAuthProvider from "../../providers/withAuthProvider";
import APIGetRoundDetail from "../../api/getRoundDetailSupabase";
import { getUrlParams } from "../../utils/browser";

import Details from "./Details";

function RoundDetails({ currentAddress, currentProvider }) {
  const history = useHistory();
  const baseUrl = "/round-details";
  const { roundId } = getUrlParams(history.location.search);
  const [roundData, setRoundData] = useState({});

  useEffect(() => {
    APIGetRoundDetail(roundId, currentProvider).then((dataRound) => {
      setRoundData(dataRound);
    });
  }, []);

  return (
    <Switch>
      <Route
        path={baseUrl}
        component={() => (
          <Details
            roundData={roundData}
            roundId={roundId}
            currentAddress={currentAddress}
            currentProvider={currentProvider}
          />
        )}
      />
    </Switch>
  );
}

RoundDetails.propTypes = {
  currentAddress: PropTypes.string,
  currentProvider: PropTypes.string,
};

RoundDetails.defaultProps = {
  currentAddress: undefined,
  currentProvider: undefined,
};

// RoundDetails.propTypes = {
//   currentAddress: PropTypes.string.isRequired,
//   currentProvider: PropTypes.string,
// };

// RoundDetails.defaultProps = {
//   currentProvider: undefined,
// };

// const mapStateToProps = (state) => {
//   const currentAddress = state?.main?.currentAddress;
//   const currentProvider = state?.main?.currentProvider;
//   return { currentAddress, currentProvider };
// };

// const mapDispatchToProps = () => ({});

// export default connect(mapStateToProps, mapDispatchToProps)(memo(RoundDetails));

const mapStateToProps = (state) => {
  const currentAddress = state?.main?.currentAddress;
  const currentProvider = state?.main?.currentProvider;
  return { currentAddress, currentProvider };
};

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthProvider(RoundDetails));
