import React, { useState, useEffect, useContext } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import APIGetRoundDetail from "../../api/getRoundDetailSupabase";
import { getUrlParams } from "../../utils/browser";

import Details from "./Details";
import { MainContext } from "../../providers/provider";

function RoundDetails() {
  const history = useHistory();
  const baseUrl = "/round-details";
  const { roundId } = getUrlParams(history.location.search);
  const [roundData, setRoundData] = useState({});
  const { currentAddress, wallet, currentProvider } = useContext(MainContext);

  useEffect(() => {
    APIGetRoundDetail(roundId, wallet, currentProvider).then((dataRound) => {
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
            wallet={wallet}
          />
        )}
      />
    </Switch>
  );
}

export default RoundDetails;
