import React, { useContext, useEffect, useState } from "react";

import PropTypes from "prop-types";
import APIGetRounds, {
  getAll,
  configByPosition,
} from "../api/getRoundsSupabase";
import APIGetOtherRounds, {
  getAllOtherRounds,
  configByPositionOther,
} from "../api/getRoundsOthersSupabase";
import APIGetRoundsByInvitation, {
  getRoundInvite,
  getUserAdminEmail,
  configByInvitation,
} from "../api/getRoundsByInvitationSupabase";
import { MainContext } from "../providers/provider";
import supabase from "../supabase";
import { HistoryState } from "../utils/constants";

export const RoundsContext = React.createContext({
  user: null,
  roundList: null,
  historyList: null,
  otherRounds: null,
  invitations: null,
  handleGetRounds: () => {},
  completeRoundList: null,
  activeRounds: null,
});

export const useRoundContext = () => useContext(RoundsContext);

const useRoundProvider = () => {
  const user = supabase.auth.user();

  const [roundList, setRoundList] = useState(null);
  const [historyList, setHistoryList] = useState(null);

  const [otherRounds, setOtherList] = useState(null);
  const [activeRounds, setActiveRounds] = useState(null);
  const [invitations, setInvitationsList] = useState(null);

  const [completeRoundList, setCompleteRoundList] = useState(null);

  const { currentAddress, wallet, currentProvider } = useContext(MainContext);

  const getRoundsOtherData = async (
    roundsPosition,
    userId,
    walletAddress,
    provider
  ) => {
    roundsPosition.forEach((positionRound) => {
      getAllOtherRounds(userId, positionRound).then((res) => {
        if (res === undefined) return;
        configByPositionOther(
          res,
          positionRound,
          walletAddress,
          provider,
          currentProvider
        ).then((resData) => {
          if (resData.stage === "ON_ROUND_ACTIVE") {
            setActiveRounds((oldArray) => [...(oldArray || []), resData]);
          }
          if (resData.stage === "ON_REGISTER_STAGE") {
            setOtherList((oldArray) => [...(oldArray || []), resData]);
          }
        });
      });
    });
  };

  const getRoundsByInvitationData = (invitesData, provider) => {
    invitesData.forEach((invite) => {
      getRoundInvite(invite).then((round) => {
        getUserAdminEmail(round.userAdmin).then((roundAdmin) => {
          configByInvitation(round, provider, roundAdmin, currentProvider).then(
            (roundData) => {
              setInvitationsList((oldArray) => [
                ...(oldArray || []),
                roundData,
              ]);
            }
          );
        });
      });
    });
  };

  const getRoundsData = (
    rounds,
    userId,
    walletAddress,
    provider,
    currentProv
  ) => {
    rounds.forEach((round) => {
      getAll(userId, round).then((res) => {
        configByPosition(round, res, walletAddress, provider, currentProv).then(
          (resData) => {
            if (resData.stage === "ON_ROUND_ACTIVE") {
              setActiveRounds((oldArray) => [...(oldArray || []), resData]);
            }
            if (resData.stage === "ON_REGISTER_STAGE") {
              setRoundList((oldArray) => [...(oldArray || []), resData]);
            }
            HistoryState.forEach((item) => {
              if (resData.stage === item) {
                setHistoryList((oldArray) => [...(oldArray || []), resData]);
              }
            });
          }
        );
      });
    });
  };

  const handleGetRounds = async (address, provider, wall) => {
    setRoundList(null);
    setOtherList(null);
    setInvitationsList(null);
    setCompleteRoundList(null);
    setHistoryList(null);
    setActiveRounds(null);
    if (user && address) {
      const rounds = await APIGetRounds({
        userId: user.id,
      });
      getRoundsData(rounds, user.id, address, wall, provider);

      const invitationsData = await APIGetRoundsByInvitation({
        email: user.email,
      });
      getRoundsByInvitationData(invitationsData, wall);
      const otherRoundsPosition = await APIGetOtherRounds({
        userId: user.id,
      });

      getRoundsOtherData(otherRoundsPosition, user.id, address, wall);
    }
  };

  useEffect(() => {
    setCompleteRoundList(null);
    if ((roundList, invitations, otherRounds)) {
      setCompleteRoundList((oldArray) => [
        ...(oldArray || []),
        ...(roundList || []),
        ...(invitations || []),
        ...(otherRounds || []),
      ]);
    }
  }, [roundList, invitations, otherRounds]);

  useEffect(() => {
    setCompleteRoundList(null);
    setHistoryList(null);
    if (currentAddress && wallet && currentProvider) {
      handleGetRounds(currentAddress, currentProvider, wallet);
    }
  }, [currentAddress, wallet, currentProvider]);

  return {
    user,
    roundList,
    historyList,
    otherRounds,
    invitations,
    handleGetRounds,
    completeRoundList,
    activeRounds,
  };
};

export function ProvideRound({ children }) {
  const rounds = useRoundProvider();
  return (
    <RoundsContext.Provider value={rounds}>
      {!rounds.loading && children}
    </RoundsContext.Provider>
  );
}
ProvideRound.propTypes = {
  children: PropTypes.node.isRequired,
};
