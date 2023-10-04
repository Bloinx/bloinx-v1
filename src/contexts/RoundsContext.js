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
import config, { walletConnect } from "../api/config.sg.web3";
import supabase from "../supabase";
import { RoundState, HistoryState } from "../utils/constants";

export const RoundsContext = React.createContext({});

export const useRoundContext = () => useContext(RoundsContext);

const useRoundProvider = () => {
  const user = supabase.auth.user();

  const [roundList, setRoundList] = useState([]);
  const [historyList, setHistoryList] = useState([]);

  const [otherRounds, setOtherList] = useState([]);
  const [invitations, setInvitationsList] = useState([]);

  const [completeRoundList, setCompleteRoundList] = useState([]);
  const [sgRounds, setSgRounds] = useState([]);

  const { currentAddress, wallet, currentProvider } = useContext(MainContext);

  const getSgMethodByRoundId = (sgRoundMethod, roundId) => {
    const sgMethod = sgRoundMethod.find((item) => item.roundId === roundId);
    return sgMethod;
  };
  // const getSgMethods = async (round) => {
  //   const sgMethods =
  //     wallet !== "WalletConnect"
  //       ? await config(round?.contract, currentProvider)
  //       : await walletConnect(round?.contract);
  //   setSgRounds((oldArray) => [
  //     ...oldArray,
  //     {
  //       roundId: round.id,
  //       sg: sgMethods,
  //     },
  //   ]);
  //   return sgMethods;
  // };

  const getRoundsOtherData = async (roundsPosition, userId, walletAddress) => {
    roundsPosition.forEach(async (positionRound) => {
      const sgMethods =
        wallet !== "WalletConnect"
          ? await config(positionRound?.contract, currentProvider)
          : await walletConnect(positionRound?.contract);
      setSgRounds((oldArray) => [
        ...oldArray,
        {
          roundId: positionRound.id,
          sg: sgMethods,
        },
      ]);
      console.log("sgMethods othrr data", sgMethods);
      getAllOtherRounds(userId, positionRound).then((res) => {
        if (res === undefined) return;
        configByPositionOther(
          res,
          positionRound,
          walletAddress,
          sgMethods
        ).then((resData) => {
          RoundState.forEach((item) => {
            if (resData.stage === item) {
              setOtherList((oldArray) => [...oldArray, resData]);
            }
          });
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
              setInvitationsList((oldArray) => [...oldArray, roundData]);
            }
          );
        });
      });
    });
  };

  const getRoundsData = (rounds, userId, walletAddress) => {
    rounds.forEach(async (round) => {
      const sgMethods =
        wallet !== "WalletConnect"
          ? await config(round?.contract, currentProvider)
          : await walletConnect(round?.contract);
      setSgRounds((oldArray) => [
        ...oldArray,
        {
          roundId: round.id,
          sg: sgMethods,
        },
      ]);
      console.log("sgMethods", sgMethods);
      getAll(userId, round).then((res) => {
        configByPosition(round, res, walletAddress, sgMethods).then(
          (resData) => {
            RoundState.forEach((item) => {
              if (resData.stage === item) {
                setRoundList((oldArray) => [...oldArray, resData]);
              }
            });
            HistoryState.forEach((item) => {
              if (resData.stage === item) {
                setHistoryList((oldArray) => [...oldArray, resData]);
              }
            });
          }
        );
      });
    });
  };

  const handleGetRounds = async (address, wall) => {
    setRoundList([]);
    setOtherList([]);
    setInvitationsList([]);
    setCompleteRoundList([]);
    setHistoryList([]);
    if (user && address) {
      const rounds = await APIGetRounds({
        userId: user.id,
      });

      getRoundsData(rounds, user.id, address);

      const invitationsData = await APIGetRoundsByInvitation({
        email: user.email,
      });
      getRoundsByInvitationData(invitationsData, wall);
      const otherRoundsPosition = await APIGetOtherRounds({
        userId: user.id,
      });

      getRoundsOtherData(otherRoundsPosition, user.id, address);
    }
  };

  useEffect(() => {
    setCompleteRoundList([]);
    if ((roundList, invitations, otherRounds)) {
      setCompleteRoundList((oldArray) => [
        ...oldArray,
        ...roundList,
        ...invitations,
        ...otherRounds,
      ]);
    }
  }, [roundList, invitations, otherRounds]);

  useEffect(() => {
    setCompleteRoundList([]);
    setHistoryList([]);
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
    getSgMethodByRoundId,
    sgRounds,
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
