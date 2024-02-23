/* eslint-disable react/self-closing-comp */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useIntl } from "react-intl";
import { Flex, Modal } from "antd";
import { MailOutlined } from "@ant-design/icons";
import PageSubHeader from "../../components/PageSubHeader";
import InputLabel from "../../components/InputLabel";

import { formatAddress } from "../../utils/format";
import styles from "./Details.module.scss";
import getFuturePayments from "../../api/getFuturePaymentsSupabase";
import PageHeaderDetails from "../../components/PageHeaderDetails";
import { ButtonAction } from "../../components/styles";
import APISetWithdrawTurn from "../../api/setWithdrawTurnSupabase";
import APISetEndRound from "../../api/setEndRound";

function Details({
  roundData,
  roundId,
  currentAddress,
  wallet,
  roundDataById,
  currentProvider,
  handleGetRounds,
}) {
  const intl = useIntl();
  const history = useHistory();
  const [userTurn, setUserTurn] = useState("");
  useEffect(() => {
    if (!roundData || !currentAddress) return;

    const turn = roundData?.participantsData?.find((participant) => {
      if (participant.walletAddress === currentAddress) {
        return participant.position;
      }
      return null;
    });
    setUserTurn(turn?.position);
  }, [roundData, currentAddress]);

  useEffect(() => {
    if (!roundDataById) return;
  }, [roundDataById]);

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

  const handleWithdrawRound = (realTurn, groupSize, contract) => {
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
        // setLoading(false);
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
        // setLoading(false);
        // handleGetRounds(currentAddress, currentProvider, wallet);
      });
  };

  return (
    <>
      <PageHeaderDetails
        title={roundData?.positionAdminData?.alias}
        turn={Number(roundData?.realTurn)}
        groupSize={Number(roundData?.groupSize)}
        showDetails
      />

      {roundData.stage === "ON_ROUND_ACTIVE" && (
        <Flex gap={10}>
          <ButtonAction
            onClick={() => {
              history.push(`/payment?roundId=${roundId}`);
            }}
            disabled={
              Number(roundDataById?.realTurn) > Number(roundData?.groupSize)
            }
            type="primary"
          >
            {" "}
            {paymentStatusText[roundDataById?.paymentStatus]?.toUpperCase()}
          </ButtonAction>
          <ButtonAction
            ghost
            type="primary"
            disabled={!roundDataById?.withdraw}
            // disabled={userTurn !== roundData?.turn}
            onClick={() =>
              handleWithdrawRound(
                roundDataById?.realTurn,
                roundData.groupSize,
                roundDataById?.contract
              )
            }
          >
            {" "}
            {roundDataById?.realTurn >= roundData.groupSize &&
            Number(roundDataById?.realTurn) > Number(roundData?.groupSize)
              ? `${intl.formatMessage({
                  id: "dashboardPage.functions.handleButton.ON_ROUND_ACTIVE.withdrawText",
                })}`
              : `${intl.formatMessage({
                  id: "dashboardPage.functions.handleButton.ON_ROUND_ACTIVE.withdrawTextElse",
                })}`}
          </ButtonAction>
        </Flex>
      )}

      <InputLabel
        label={`${intl.formatMessage({
          id: "roundDetails.contractID",
        })}`}
        value={formatAddress(roundData.contract)}
      />
      <InputLabel
        label={`${intl.formatMessage({
          id: "roundDetails.status",
        })}`}
        value={roundData.stage}
      />
      <InputLabel
        label={`${intl.formatMessage({
          id: "roundDetails.total",
        })}`}
        value={roundData?.futurePayments}
      />
      <InputLabel
        label={`${intl.formatMessage({
          id: "roundDetails.participants",
        })}`}
        value={
          <table className={styles.DetailParticipantsItem}>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th>{`${intl.formatMessage({
                id: "roundDetails.payment",
              })}`}</th>
            </tr>
            {roundData.participantsData &&
              roundData.participantsData.map((participant) => (
                <tr key={participant.address}>
                  <th>{participant.position}</th>
                  <th>{formatAddress(participant.address)}</th>
                  <th>{participant.admin && "Admin"}</th>
                  <th>{participant.dateToWithdraw}</th>
                </tr>
              ))}
          </table>
        }
      />
      {roundData.stage === "ON_REGISTER_STAGE" &&
        roundData?.positionAdminData?.wallet === currentAddress &&
        currentAddress !== null && (
          <>
            <PageSubHeader
              title={`${intl.formatMessage({
                id: "roundDetails.header",
              })}`}
            />
            <Link
              to={`/invitations?roundId=${roundId}`}
              className={styles.RoundCardTitle}
            >
              <MailOutlined style={{ color: "white", fontSize: "20px" }} />
            </Link>
            <InputLabel
              label={`${intl.formatMessage({
                id: "roundDetails.invitationTitle",
              })}`}
              value={
                <div className={styles.DetailParticipantsItem}>
                  {roundData.invitations &&
                    roundData.invitations?.map((email) => {
                      if (email.isRegister === false) {
                        return (
                          <ul key={email.id}>
                            <li>{email.userEmail}</li>
                          </ul>
                        );
                      }
                      return "";
                    })}
                </div>
              }
            />
          </>
        )}
    </>
  );
}

export default Details;
