import React, { useState, useEffect, useContext } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import APIGetRoundDetail from "../../api/getRoundDetailSupabase";
import { getUrlParams } from "../../utils/browser";

import Details from "./Details";
import { MainContext } from "../../providers/provider";
import { useRoundContext } from "../../contexts/RoundsContext";
import Loader from "../../components/Loader";

function RoundDetails() {
  const history = useHistory();
  const baseUrl = "/round-details";
  const { roundId } = getUrlParams(history.location.search);
  const [roundData, setRoundData] = useState();
  const [roundDataById, setRoundDataById] = useState(null);
  const { currentAddress, wallet, currentProvider } = useContext(MainContext);
  const { activeRounds, handleGetRounds } = useRoundContext();

  useEffect(() => {
    if (!roundId || !activeRounds) return;
    activeRounds.forEach((round) => {
      if (round.roundKey === roundId) {
        setRoundDataById(round);
      }
    });
  }, [activeRounds, roundId]);

  useEffect(() => {
    if (!roundId || !wallet || !currentProvider || !currentAddress) return;
    APIGetRoundDetail(roundId, wallet, currentProvider, currentAddress).then(
      (dataRound) => {
        setRoundData(dataRound);
      }
    );
  }, [roundId, wallet, currentProvider, currentAddress]);

  if (!roundData) {
    return <Loader loadingMessage="infoLoader.roundPage" />;
  }
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
            roundDataById={roundDataById}
            currentProvider={currentProvider}
            handleGetRounds={handleGetRounds}
          />
        )}
      />
    </Switch>
  );
}

export default RoundDetails;
