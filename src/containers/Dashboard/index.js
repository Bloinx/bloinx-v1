/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
// import PropTypes from "prop-types";
import { Modal, Button } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

import RoundCard from "./RoundCard";
import RoundCardNew from "./RoundCardNew";
import PageHeader from "../../components/PageHeader";
import PageSubHeader from "../../components/PageSubHeader";
import styles from "./Dashboard.module.scss";
import APISetStartRound from "../../api/setStartRoundSupabase";
import APISetAddPayment from "../../api/setAddPaymentSupabase";
import APISetWithdrawTurn from "../../api/setWithdrawTurnSupabase";
import APIGetFuturePayments from "../../api/getFuturePaymentsSupabase";
import APISetEndRound from "../../api/setEndRound";
import Placeholder from "../../components/Placeholder";
import NotFoundPlaceholder from "../../components/NotFoundPlaceholder";
import { useRoundContext } from "../../contexts/RoundsContext";

import { MainContext } from "../../providers/provider";
import { CardDashboard } from "./CardDashboard";

function Dashboard() {
  const history = useHistory();
  const { otherList, handleGetRounds, completeRoundList, activeRounds } =
    useRoundContext();
  const [loading, setLoading] = useState(false);
  const { currentAddress, wallet, currentProvider } = useContext(MainContext);
  const intl = useIntl();

  const goToCreate = () => {
    history.push("/create-round");
  };

  const goToJoin = (roundKey) => {
    history.push(`/register-user?roundId=${roundKey}`);
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
        handleGetRounds(currentAddress, currentProvider, wallet);
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
      wallet,
      currentProvider
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
              handleGetRounds(currentAddress, currentProvider, wallet);
            })
            .catch((err) => {
              Modal.error({
                title: `${intl.formatMessage({
                  id: "dashboardPage.functions.handlePayRound.APISetAddPayment.error.title",
                })}`,
                content: "...",
              });
              setLoading(false);
              handleGetRounds(currentAddress, currentProvider, wallet);
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

  const handleWithdrawRound = (roundId, realTurn, groupSize, contract) => {
    setLoading(true);
    APISetWithdrawTurn(roundId, currentAddress, wallet, currentProvider)
      .then(() => {
        if (Number(realTurn) > Number(groupSize)) {
          Modal.warning({
            title: `${intl.formatMessage({
              id: "dashboardPage.functions.endRound.success.title",
            })}`,
            content: `${intl.formatMessage({
              id: "dashboardPage.functions.endRound.success.content",
            })}`,
            onOk: () => {
              APISetEndRound(contract, currentAddress, wallet, currentProvider);
            },
            okText: `${intl.formatMessage({
              id: "dashboardPage.functions.endRound.success.buttonText",
            })}`,
          });
        } else {
          Modal.success({
            title: `${intl.formatMessage({
              id: "dashboardPage.functions.handleWithdrawRound.success.title",
            })}`,
            content: `${intl.formatMessage({
              id: "dashboardPage.functions.handleWithdrawRound.success.content",
            })}`,
          });
        }
      })
      .finally(() => {
        setLoading(false);
        handleGetRounds(currentAddress, currentProvider, wallet);
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
        handleGetRounds(currentAddress, currentProvider, wallet);
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
        withdrawAction: () =>
          handleWithdrawRound(
            roundData.roundKey,
            roundData.realTurn,
            roundData.groupSize
          ),
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

  if (wallet === null || currentAddress === null || currentProvider === null) {
    return <Placeholder />;
  }
  return (
    <>
      <PageHeader
        title={<FormattedMessage id="dashboardPage.title" />}
        action={
          <Button
            className={styles.RoundCardAction}
            onClick={goToCreate}
            type="primary"
          >
            Crear Ronda
          </Button>
        }
      />
      <div className={styles.RoundCards}>
        {currentAddress && completeRoundList?.length === 0 && (
          <NotFoundPlaceholder />
        )}
        {currentAddress &&
          completeRoundList?.map((round) => {
            if (round?.stage === "ON_REGISTER_STAGE" && round?.toRegister) {
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
                tokenId={round.tokenId}
                byInvitation={false}
              />
            );
          })}
        {currentAddress &&
          activeRounds?.length > 0 &&
          activeRounds.map((round) => (
            <CardDashboard
              key={round.roundKey}
              contractKey={round.contract}
              turn={round.turn}
              groupSize={round.groupSize}
              name={round.name}
              positionToWithdrawPay={round.positionToWithdrawPay}
              linkTo={`/round-details?roundId=${round.roundKey}`}
            />
          ))}
      </div>
      {otherList?.length && (
        <PageSubHeader
          title={<FormattedMessage id="dashboardPage.subtitle" />}
        />
      )}
      {/* {currentAddress &&
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
              tokenId={round.tokenId}
              byInvitation
            />
          );
        })} */}
    </>
  );
}

export default Dashboard;
