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

export const RoundsContext = React.createContext({});

export const useRoundContext = () => useContext(RoundsContext);

const useRoundProvider = () => {
  const user = supabase.auth.user();
  const [roundList, setRoundList] = useState([]);
  const [otherRounds, setOtherList] = useState([]);
  const [invitations, setInvitationsList] = useState([]);
  const [completeRoundList, setCompleteRoundList] = useState([]);
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
          if (
            resData.stage === "ON_REGISTER_STAGE" ||
            resData.stage === "ON_ROUND_ACTIVE"
          ) {
            setOtherList((oldArray) => [...oldArray, resData]);
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
              if (
                roundData.stage === "ON_REGISTER_STAGE" ||
                roundData.stage === "ON_ROUND_ACTIVE"
              ) {
                setInvitationsList((oldArray) => [...oldArray, roundData]);
              }
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
            if (
              resData.stage === "ON_REGISTER_STAGE" ||
              resData.stage === "ON_ROUND_ACTIVE"
            ) {
              setRoundList((oldArray) => [...oldArray, resData]);
            }
          }
        );
      });
    });
  };

  const handleGetRounds = async (address, provider, wall) => {
    setRoundList([]);
    setOtherList([]);
    setInvitationsList([]);
    setCompleteRoundList([]);
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
    setCompleteRoundList([]);
    setCompleteRoundList((oldArray) => [
      ...oldArray,
      ...roundList,
      ...invitations,
    ]);
  }, [roundList, invitations]);

  useEffect(() => {
    setCompleteRoundList([]);
    if (currentAddress && wallet && currentProvider) {
      handleGetRounds(currentAddress, currentProvider, wallet);
    }
  }, [currentAddress, wallet, currentProvider]);

  return {
    user,
    roundList,
    otherRounds,
    invitations,
    handleGetRounds,
    completeRoundList,
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
