/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { Typography, Button, Flex } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import {
  FlexPageContainer,
  StepStyle,
  FlexPaymentContainer,
  FlexCardInfoStyle,
  FlexMessageStyle,
} from "./styles";
import { getUrlParams } from "../../utils/browser";
import { useRoundContext } from "../../contexts/RoundsContext";
import Loader from "../../components/Loader";
import { getTokenSymbol } from "../../api/utils/getTokenData";
import { MainContext } from "../../providers/provider";
import MethodGetRegisterStable from "../../api/setRegisterUserStable";
import { getAmountToApprove } from "../../api/utils/getAmountToApprove";
import handlePayRound from "../../api/utils/payRound";

const StepContent = ({
  step,
  setCurrentStep,
  data,
  tokenSymbol,
  walletAddress,
  wallet,
  chainId,
  intl,
  currentProvider,
  history,
}) => {
  const [loading, setLoading] = useState(false);
  switch (step) {
    case 0:
      return !loading ? (
        <>
          <FlexMessageStyle>
            <InfoCircleOutlined style={{ color: "#C6A15B" }} />
            <Typography.Text>
              Antes de pagar en el turno, deberás aprobar el gasto
            </Typography.Text>
          </FlexMessageStyle>
          <FlexCardInfoStyle vertical>
            <Typography.Title level={5}>Aprobación de gasto</Typography.Title>
            <Typography.Text>
              Monto aprobado {data.allowance} {tokenSymbol[0]?.symbol}
            </Typography.Text>
            <Typography.Text>
              Monto que debe aprobar{" "}
              {getAmountToApprove(
                Number(data.saveAmount),
                Number(data.groupSize),
                Number(data.turn)
              )}
              {tokenSymbol[0]?.symbol}
            </Typography.Text>
          </FlexCardInfoStyle>
          <Button
            type="primary"
            onClick={() => {
              setLoading(true);
              MethodGetRegisterStable({
                walletAddress,
                roundId: data.roundKey,
                wallet,
                chainId,
                dataApprove: {
                  amount: Number(data.saveAmount),
                  groupSize: Number(data.groupSize),
                  turn: Number(data.turn),
                },
              })
                .then(() => {
                  setCurrentStep(1);
                })
                .finally(() => {
                  setLoading(false);
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
          >
            Aprobar
          </Button>
        </>
      ) : (
        <Flex align="center" justify="center" style={{ height: "400px" }}>
          <Loader loadingMessage="infoLoader.approve" />
        </Flex>
      );
    case 1:
      return !loading ? (
        <>
          {" "}
          <FlexCardInfoStyle vertical>
            <Typography.Title level={5}>Monto a pagar:</Typography.Title>
            <Typography.Text>
              {data.saveAmount} {tokenSymbol[0]?.symbol}
            </Typography.Text>
          </FlexCardInfoStyle>
          <Button
            type="primary"
            onClick={() =>
              handlePayRound(
                data.futurePayments,
                setLoading,
                walletAddress,
                currentProvider,
                intl,
                data.contract,
                data.saveAmount,
                data.sgMethods,
                data.roundKey,
                history
              )
            }
          >
            Pagar
          </Button>
        </>
      ) : (
        <Flex align="center" justify="center" style={{ height: "400px" }}>
          <Loader loadingMessage="infoLoader.payment" />
        </Flex>
      );
    default:
      return <p>Volver a cargar</p>;
  }
};

function Payment() {
  const history = useHistory();
  const baseUrl = "/payment";
  const { roundId } = getUrlParams(history.location.search);
  const [currentStep, setCurrentStep] = React.useState(null);
  const [roundDataById, setRoundDataById] = useState(null);
  const { activeRounds } = useRoundContext();
  const [tokenSymbol, setTokenSymbol] = useState(null);
  const { currentAddress, wallet, currentProvider } = useContext(MainContext);
  const intl = useIntl();
  const getAllowanceSymbol = async (tokenId) => {
    // Call the asynchronous function getTokenSymbol with the provided tokenId
    const symbol = await getTokenSymbol(tokenId);
    return symbol || null;
  };

  useEffect(() => {
    if (!roundId || !activeRounds) return;
    activeRounds.forEach((round) => {
      if (round.roundKey === roundId) {
        setRoundDataById(round);
      }
    });
  }, [activeRounds, roundId]);

  useEffect(() => {
    if (!roundDataById) return;

    if (
      roundDataById.allowance <
      getAmountToApprove(
        Number(roundDataById.saveAmount),
        Number(roundDataById.groupSize),
        Number(roundDataById.turn)
      )
    ) {
      setCurrentStep(0);
    } else {
      setCurrentStep(1);
    }

    getAllowanceSymbol(roundDataById.tokenId)
      .then((symbol) => {
        setTokenSymbol(symbol);
      })
      .catch((error) => {
        console.error("Error in useEffect:", error);
      });
  }, [roundDataById]);

  if (roundDataById === null || tokenSymbol === null) {
    return <Loader loadingMessage="infoLoader.page" />;
  }

  return (
    <Switch>
      <Route
        path={baseUrl}
        component={() => (
          <FlexPageContainer>
            <Typography.Title level={4}>Pagar en turno</Typography.Title>
            <FlexPaymentContainer>
              <StepStyle
                current={currentStep}
                direction="horizontal"
                items={[
                  {
                    title: "Aprobar gasto",
                  },
                  {
                    title: "Pagar",
                  },
                ]}
              />

              <StepContent
                step={currentStep}
                setCurrentStep={setCurrentStep}
                data={roundDataById}
                tokenSymbol={tokenSymbol}
                walletAddress={currentAddress}
                wallet={wallet}
                chainId={currentProvider}
                intl={intl}
                currentProvider={currentProvider}
                history={history}
              />
            </FlexPaymentContainer>
          </FlexPageContainer>
        )}
      />
    </Switch>
  );
}

export default Payment;
