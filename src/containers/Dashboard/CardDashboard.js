/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
import { Button, Typography, Progress } from "antd";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import styles from "./CardDashboard.module.scss";
import { formatAddress } from "../../utils/format";
import HeaderMainRound from "../../components/HeaderMainRound";

export function CardDashboard({
  name,
  contractKey,
  groupSize,
  turn,
  linkTo,
  saveAmount,
  positionToWithdrawPay,
}) {
  const contractHeader = () => {
    return (
      <div className={styles.RoundCardContractAddress}>
        <Typography.Text>
          <FormattedMessage id="roundDetails.contractID" />
        </Typography.Text>
        <span> {formatAddress(contractKey)}</span>
      </div>
    );
  };

  const getPercentage = () => {
    const percentage = (turn / groupSize) * 100;
    return percentage;
  };
  return (
    <div className={styles.RoundCard}>
      <div className={styles.RoundCardHeader}>
        <div className={styles.RoundCardSubject}>
          <span>
            <FormattedMessage id="roundCardInfo.roundAddr" />
          </span>

          <Typography.Title level={4}>{name}</Typography.Title>
        </div>
        {contractHeader()}
        {/* {formatAddress(contractKey)} */}
      </div>
      <div className={styles.RoundCardStats}>
        <Progress
          className={styles.progress}
          type="circle"
          percent={getPercentage()}
          success={() => {
            return {
              strokeColor: "#f58f98",
              fontColor: "#f58f98",
            };
          }}
          strokeColor="primary"
          format={() => {
            return (
              <div className={styles.progressInfoContainer}>
                <span>
                  {" "}
                  <FormattedMessage id="roundCardInfo.turn" />
                </span>
                <div className={styles.progressMainInfo}>
                  <p>{turn}</p>
                  <p>/{groupSize}</p>
                </div>
              </div>
            );
          }}
        />
        <div>
          <span>
            <FormattedMessage id="roundCardInfo.myTurn" />
          </span>
          <Typography.Title level={1}>{positionToWithdrawPay}</Typography.Title>
        </div>
      </div>

      <div className={styles.RoundCardFooter}>
        <div style={{ width: "100%" }}>
          <Link to={linkTo}>
            <Button className={styles.RoundCardAction} type="primary">
              Ver más
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

CardDashboard.defaultProps = {
  name: undefined,
  linkTo: "",
  // buttonText: undefined,
  // onClick: undefined,
  positionToWithdrawPay: 0,
  // loading: false,
  // buttonDisabled: false,
  // missingPositions: undefined,
  // withdraw: undefined,
  // onWithdraw: undefined,
  // stage: "",
  saveAmount: "",
  // tokenId: null,
  // byInvitation: false,
};

CardDashboard.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  contractKey: PropTypes.string.isRequired,
  groupSize: PropTypes.string.isRequired,
  turn: PropTypes.string.isRequired,
  linkTo: PropTypes.string,
  // onClick: PropTypes.func,
  // buttonText: PropTypes.string,
  positionToWithdrawPay: PropTypes.number,
  // loading: PropTypes.bool,
  // buttonDisabled: PropTypes.bool,
  // missingPositions: PropTypes.number,
  // withdraw: PropTypes.bool,
  // onWithdraw: PropTypes.func,
  // stage: PropTypes.string,
  saveAmount: PropTypes.string,
  // tokenId: PropTypes.number,
  // byInvitation: PropTypes.bool,
};

export default React.memo(CardDashboard);
