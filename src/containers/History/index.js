/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
// import PropTypes from "prop-types";
import { Modal } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import supabase from "../../supabase";

import RoundCard from "./RoundCard";
import RoundCardNew from "./RoundCardNew";
import PageHeader from "../../components/PageHeader";
import PageSubHeader from "../../components/PageSubHeader";
import styles from "./History.module.scss";

import APIGetRounds, {
  getAll,
  configByPosition,
} from "../../api/getRoundsSupabase";
import APIGetOtherRounds, {
  getAllOtherRounds,
  configByPositionOther,
} from "../../api/getRoundsOthersSupabase";
import APIGetRoundsByInvitation, {
  getRoundInvite,
  getUserAdminEmail,
  configByInvitation,
} from "../../api/getRoundsByInvitationSupabase";
import APISetStartRound from "../../api/setStartRoundSupabase";
import APISetAddPayment from "../../api/setAddPaymentSupabase";
import APISetWithdrawTurn from "../../api/setWithdrawTurnSupabase";
import APIGetFuturePayments from "../../api/getFuturePaymentsSupabase";
import Placeholder from "../../components/Placeholder";
import NotFoundPlaceholder from "../../components/NotFoundPlaceholder";
import { MainContext } from "../../providers/provider";

function History() {
  const history = useHistory();
  // const user = getAuth().currentUser;
  const user = supabase.auth.user();
  const [roundList, setRoundList] = useState([]);
  const [invitationsList, setInvitationsList] = useState([]);
  const [otherList, setOtherList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentAddress, wallet, currentProvider } = useContext(MainContext);
  const intl = useIntl();
  const goToCreate = () => {
    history.push("/create-round");
  };

  const goToJoin = (roundKey) => {
    history.push(`/register-user?roundId=${roundKey}`);
  };

  const getRoundsData = (rounds, userId, walletAddress, provider) => {
    rounds.forEach((round, index) => {
      getAll(userId, round).then((res) => {
        configByPosition(
          round,
          res,
          walletAddress,
          provider,
          currentProvider
        ).then((resData) => {
          if (
            resData.stage === "ON_ROUND_FINISHED" ||
            resData.stage === "ON_EMERGENCY_STAGE"
          ) {
            setRoundList((oldArray) => [...oldArray, resData]);
          }
        });
      });
    });
  };

  const getRoundsOtherData = (
    roundsPosition,
    userId,
    walletAddress,
    provider
  ) => {
    roundsPosition.forEach((positionRound, index) => {
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
            resData.stage === "ON_ROUND_FINISHED" ||
            resData.stage === "ON_EMERGENCY_STAGE"
          ) {
            setOtherList((oldArray) => [...oldArray, resData]);
          }
        });
      });
    });
  };

  const getRoundsByInvitationData = (invitesData, provider) => {
    invitesData.forEach((invite, index) => {
      getRoundInvite(invite).then((round) => {
        getUserAdminEmail(round.userAdmin).then((roundAdmin) => {
          configByInvitation(round, provider, roundAdmin, currentProvider).then(
            (roundData) => {
              if (
                roundData.stage === "ON_ROUND_FINISHED" ||
                roundData.stage === "ON_EMERGENCY_STAGE"
              ) {
                setInvitationsList((oldArray) => [...oldArray, roundData]);
              }
            }
          );
        });
      });
    });
  };

  const handleGetRounds = async () => {
    setRoundList([]);
    setOtherList([]);
    setInvitationsList([]);

    if (user && currentAddress) {
      const rounds = await APIGetRounds({
        userId: user.id,
      });

      getRoundsData(rounds, user.id, currentAddress, wallet);

      const invitations = await APIGetRoundsByInvitation({ email: user.email });
      getRoundsByInvitationData(invitations, wallet);
      const otherRoundsPosition = await APIGetOtherRounds({
        userId: user.id,
      });

      getRoundsOtherData(otherRoundsPosition, user.id, currentAddress, wallet);
    }
  };

  const handleStartRound = (roundId) => {
    setLoading(true);
    APISetStartRound(roundId, wallet, currentProvider)
      .then((receipt) => {
        Modal.success({
          title: `${intl.formatMessage({
            id: "dashboardPage.functions.handleStartRound.success.title",
          })}`,
          content: `${intl.formatMessage({
            id: "dashboardPage.functions.handleStartRound.success.content",
          })}`,
        });
        setLoading(false);
        handleGetRounds();
      })
      .catch((err) => {
        Modal.warning({
          title: `${intl.formatMessage({
            id: "dashboardPage.functions.handleStartRound.error.title",
          })}`,
          content: `${intl.formatMessage({
            id: "dashboardPage.functions.handleStartRound.error.content",
          })}`,
        });
        setLoading(false);
      });
  };

  const handlePayRound = (roundId) => {
    setLoading(true);
    const remainingAmount = APIGetFuturePayments(
      roundId,
      currentAddress,
      wallet
    );
    remainingAmount
      .then((amount) => {
        if (amount > 0) {
          APISetAddPayment({
            roundId,
            walletAddress: currentAddress,
            wallet,
            currentProvider,
          })
            .then((success) => {
              Modal.success({
                title: `${intl.formatMessage({
                  id: "dashboardPage.functions.handlePayRound.APISetAddPayment.success.title",
                })}`,
                content: "...",
              });
              setLoading(false);
              handleGetRounds();
            })
            .catch((err) => {
              Modal.error({
                title: `${intl.formatMessage({
                  id: "dashboardPage.functions.handlePayRound.APISetAddPayment.error.title",
                })}`,
                content: "...",
              });
              setLoading(false);
              handleGetRounds();
            });
        } else {
          Modal.success({
            content: `${intl.formatMessage({
              id: "dashboardPage.functions.handlePayRound.APIGetFuturePayments.success.content",
            })}`,
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        Modal.error({
          title: `${intl.formatMessage({
            id: "dashboardPage.functions.handlePayRound.APIGetFuturePayments.error.title",
          })}`,
          content: `${intl.formatMessage({
            id: "dashboardPage.functions.handlePayRound.APIGetFuturePayments.error.content",
          })}`,
        });
        setLoading(false);
      });
  };

  const handleWithdrawRound = (roundId) => {
    setLoading(true);
    APISetWithdrawTurn(roundId, currentAddress, wallet)
      .then(() => {
        Modal.success({
          title: `${intl.formatMessage({
            id: "dashboardPage.functions.handleWithdrawRound.success.title",
          })}`,
          content: `${intl.formatMessage({
            id: "dashboardPage.functions.handleWithdrawRound.success.content",
          })}`,
        });
        setLoading(false);
        handleGetRounds();
      })
      .catch(() => {
        Modal.error({
          title: `${intl.formatMessage({
            id: "dashboardPage.functions.handleWithdrawRound.error.title",
          })}`,
          content: `${intl.formatMessage({
            id: "dashboardPage.functions.handleWithdrawRound.error.content",
          })}`,
        });
        setLoading(false);
        handleGetRounds();
      });
  };

  const paymentStatusText = {
    payments_on_time: `${intl.formatMessage({
      id: "dashboardPage.paymentStatusText.payments_on_time",
    })}`,
    payments_advanced: `${intl.formatMessage({
      id: "dashboardPage.paymentStatusText.payments_advanced",
    })}`,
    payments_late: `${intl.formatMessage({
      id: "dashboardPage.paymentStatusText.payments_late",
    })}`,
    payments_done: `${intl.formatMessage({
      id: "dashboardPage.paymentStatusText.payments_done",
    })}`,
  };

  const handleButton = (roundData) => {
    const { stage, isAdmin, missingPositions, withdraw, turn } = roundData;
    if (stage === "ON_REGISTER_STAGE" && isAdmin) {
      return {
        disable: missingPositions > 0,
        text: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_REGISTER_STAGE_ADMIN.text",
        })}`,
        action: () => handleStartRound(roundData.roundKey),
        withdrawText: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_REGISTER_STAGE_ADMIN.withdrawText",
        })}`,
        withdrawAction: null,
      };
    }
    if (stage === "ON_REGISTER_STAGE" && !isAdmin) {
      return {
        disable: true,
        text: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_REGISTER_STAGE.text",
        })}`,
        action: () => {},
        withdrawText: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_REGISTER_STAGE.withdrawText",
        })}`,
        withdrawAction: null,
      };
    }
    if (stage === "ON_ROUND_ACTIVE") {
      const payDisable = roundData.realTurn > roundData.groupSize;

      return {
        disable: payDisable,
        text: paymentStatusText[roundData.paymentStatus],
        action: () => handlePayRound(roundData.roundKey),
        withdrawText:
          roundData.realTurn >= roundData.groupSize && payDisable
            ? `${intl.formatMessage({
                id: "dashboardPage.functions.handleButton.ON_ROUND_ACTIVE.withdrawText",
              })}`
            : `${intl.formatMessage({
                id: "dashboardPage.functions.handleButton.ON_ROUND_ACTIVE.withdrawTextElse",
              })}`,
        withdrawAction: () => handleWithdrawRound(roundData.roundKey),
      };
    }
    if (stage === "ON_ROUND_FINISHED") {
      return {
        disable: true,
        text: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_ROUND_FINISHED.text",
        })}`,
        action: () => {},
        withdrawText: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_ROUND_FINISHED.withdrawText",
        })}`,
        withdrawAction: () => {},
      };
    }
    if (stage === "ON_EMERGENCY_STAGE") {
      return {
        disable: true,
        text: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_EMERGENCY_STAGE.text",
        })}`,
        action: () => {},
        withdrawText: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_EMERGENCY_STAGE.withdrawText",
        })}`,
        withdrawAction: () => {},
      };
    }
    return {};
  };

  useEffect(() => handleGetRounds(), [currentAddress]);

  if (!currentAddress) {
    return <Placeholder />;
  }

  const completeRoundList = roundList?.concat(invitationsList);
  return (
    <>
      <PageHeader
        title={<FormattedMessage id="historyPage.title" />}
        action={
          <PlusCircleOutlined
            onClick={goToCreate}
            style={{ fontSize: "20px", color: "white" }}
          />
        }
      />
      <div className={styles.RoundCards}>
        {currentAddress && completeRoundList?.length === 0 && (
          <NotFoundPlaceholder />
        )}
        {currentAddress &&
          completeRoundList?.map((round) => {
            if (round.stage === "ON_REGISTER_STAGE" && round.toRegister) {
              return (
                <RoundCardNew
                  key={round.roundKey}
                  fromInvitation={round.fromInvitation}
                  fromEmail={round.fromEmail}
                  onClick={() => goToJoin(round.roundKey)}
                />
              );
            }
            const { disable, text, action, withdrawText, withdrawAction } =
              handleButton(round);
            return (
              <RoundCard
                key={round.roundKey}
                name={round.name}
                groupSize={round.groupSize}
                missingPositions={round.missingPositions}
                contractKey={round.contract}
                positionToWithdrawPay={round.positionToWithdrawPay}
                turn={round.turn}
                linkTo={`/round-details?roundId=${round.roundKey}`}
                onClick={action}
                buttonText={text}
                withdrawButtonText={withdrawText}
                buttonDisabled={disable}
                loading={loading}
                withdraw={round.withdraw}
                onWithdraw={withdrawAction}
                stage={round.stage}
                saveAmount={round.saveAmount}
                byInvitation={false}
              />
            );
          })}
      </div>
      {otherList?.length && (
        <PageSubHeader title={<FormattedMessage id="historyPage.subtitle" />} />
      )}
      {currentAddress &&
        otherList &&
        otherList?.map((round) => {
          const { disable, text, action, withdrawText, withdrawAction } =
            handleButton(round);
          return (
            <RoundCard
              key={round.roundKey}
              name={round.name}
              groupSize={round.groupSize}
              missingPositions={round.missingPositions}
              contractKey={round.contract}
              positionToWithdrawPay={round.positionToWithdrawPay}
              turn={round.turn}
              linkTo={`/round-details?roundId=${round.roundKey}`}
              onClick={action}
              buttonText={text}
              withdrawButtonText={withdrawText}
              buttonDisabled={disable}
              loading={loading}
              withdraw={round.withdraw}
              onWithdraw={withdrawAction}
              stage={round.stage}
              saveAmount={round.saveAmount}
              byInvitation
            />
          );
        })}
    </>
  );
}

export default History;
