/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import supabase from "../../supabase";

import RoundCard from "./RoundCard";
import RoundCardNew from "./RoundCardNew";
import PageHeader from "../../components/PageHeader";
import PageSubHeader from "../../components/PageSubHeader";
import styles from "./Dashboard.module.scss";

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

function Dashboard({ currentAddress, currentProvider }) {
  const history = useHistory();
  // const user = getAuth().currentUser;
  const user = supabase.auth.user();
  const [roundList, setRoundList] = useState([]);
  const [invitationsList, setInvitationsList] = useState([]);
  const [otherList, setOtherList] = useState([]);
  const [loading, setLoading] = useState(false);

  const goToCreate = () => {
    history.push("/create-round");
  };

  const goToJoin = (roundKey) => {
    history.push(`/register-user?roundId=${roundKey}`);
  };

  const getRoundsData = (rounds, userId, walletAddress, provider) => {
    rounds.forEach((round, index) => {
      getAll(userId, round).then((res) => {
        configByPosition(round, res, walletAddress, provider).then(
          (resData) => {
            setRoundList((oldArray) => [...oldArray, resData]);
          }
        );
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
        configByPositionOther(res, positionRound, walletAddress, provider).then(
          (resData) => {
            setOtherList((oldArray) => [...oldArray, resData]);
          }
        );
      });
    });
  };

  const getRoundsByInvitationData = (invitesData, provider) => {
    invitesData.forEach((invite, index) => {
      getRoundInvite(invite).then((round) => {
        getUserAdminEmail(round.userAdmin).then((roundAdmin) => {
          configByInvitation(round, provider, roundAdmin).then((roundData) => {
            setInvitationsList((oldArray) => [...oldArray, roundData]);
          });
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

      getRoundsData(rounds, user.id, currentAddress, currentProvider);

      const invitations = await APIGetRoundsByInvitation({ email: user.email });
      getRoundsByInvitationData(invitations, currentProvider);
      const otherRoundsPosition = await APIGetOtherRounds({
        userId: user.id,
      });

      getRoundsOtherData(
        otherRoundsPosition,
        user.id,
        currentAddress,
        currentProvider
      );
    }
  };

  const handleStartRound = (roundId) => {
    setLoading(true);
    APISetStartRound(roundId, currentProvider)
      .then((receip) => {
        Modal.success({
          title: "Ronda iniciada correctamente",
          content: "Por favor verifica.",
        });
        setLoading(false);
        handleGetRounds();
      })
      .catch((err) => {
        Modal.warning({
          title: "Error al activar iniciar la ronda",
          content: "Por favor verifica que tu wallet este activa y reintenta.",
        });
        setLoading(false);
      });
  };

  const handlePayRound = (roundId) => {
    setLoading(true);
    const remainingAmount = APIGetFuturePayments(
      roundId,
      currentAddress,
      currentProvider
    );
    remainingAmount
      .then((amount) => {
        if (amount > 0) {
          APISetAddPayment({
            roundId,
            walletAddress: currentAddress,
            provider: currentProvider,
          })
            .then((success) => {
              Modal.success({
                title: "Pago correcto",
                content: "...",
              });
              setLoading(false);
              handleGetRounds();
            })
            .catch((err) => {
              Modal.error({
                title: "Error al realizar el pago",
                content: "...",
              });
              setLoading(false);
              handleGetRounds();
            });
        } else {
          Modal.success({
            content: "¡Felicidades! Has completado todos tus pagos",
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        Modal.error({
          title: "Error",
          content: "Error al obtener información de tus pagos",
        });
        setLoading(false);
      });
  };

  const handleWithdrawRound = (roundId) => {
    setLoading(true);
    APISetWithdrawTurn(roundId, currentAddress, currentProvider)
      .then(() => {
        Modal.success({
          title: "Cobro correcto",
          content: "El cobro de la ronda a sido efectuado correctamente",
        });
        setLoading(false);
        handleGetRounds();
      })
      .catch(() => {
        Modal.error({
          title: "Error al realizar el cobro",
          content:
            "No pudimos realizar el cobro de tu ronda. Por favor verifica mas tarde o intenta nuevamente.",
        });
        setLoading(false);
        handleGetRounds();
      });
  };

  const paymentStatusText = {
    payments_on_time: "Adelantar pago",
    payments_advanced: "Adelantar otro pago",
    payments_late: "Pagar",
  };

  const handleButton = (roundData) => {
    const { stage, isAdmin, missingPositions, withdraw, turn } = roundData;
    console.log(stage);
    if (stage === "ON_REGISTER_STAGE" && isAdmin) {
      return {
        disable: missingPositions > 0,
        text: "Iniciar",
        action: () => handleStartRound(roundData.roundKey),
        withdrawText: "Cobrar",
        withdrawAction: null,
      };
    }
    if (stage === "ON_REGISTER_STAGE" && !isAdmin) {
      return {
        disable: true,
        text: "Pendiente",
        action: () => {},
        withdrawText: "Cobrar",
        withdrawAction: null,
      };
    }
    if (stage === "ON_ROUND_ACTIVE") {
      const payDisable = roundData.positionToWithdrawPay === Number(turn);

      return {
        disable: false,
        text: paymentStatusText[roundData.paymentStatus],
        action: () => handlePayRound(roundData.roundKey),
        withdrawText:
          roundData.realTurn >= roundData.groupSize && payDisable
            ? "Terminar y Cobrar"
            : "Cobrar",
        withdrawAction: () => handleWithdrawRound(roundData.roundKey),
      };
    }
    if (stage === "ON_ROUND_FINISHED") {
      return {
        disable: true,
        text: "Finalizado",
        action: () => {},
        withdrawText: "Finalizado",
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
        title={<FormattedMessage id="dashboardPage.title" />}
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
        <PageSubHeader
          title={<FormattedMessage id="dashboardPage.subtitle" />}
        />
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

Dashboard.propTypes = {
  currentAddress: PropTypes.string,
  currentProvider: PropTypes.string,
};

Dashboard.defaultProps = {
  currentAddress: undefined,
  currentProvider: undefined,
};

export default Dashboard;
