import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import withAuthProvider from "../../providers/withAuthProvider";
import APIGetRoundDetail from "../../api/getRoundDetailSupabase";
import { getUrlParams } from "../../utils/browser";

import Details from "./Details";
import { MainContext } from "../../providers/provider";

function RoundDetails({ currentProvider }) {
  const history = useHistory();
  const baseUrl = "/round-details";
  const { roundId } = getUrlParams(history.location.search);
  const [roundData, setRoundData] = useState({});
  const { currentAddress } = useContext(MainContext);

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
  currentProvider: PropTypes.string,
};

RoundDetails.defaultProps = {
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
  const currentProvider = state?.main?.currentProvider;
  return { currentProvider };
};

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthProvider(RoundDetails));
