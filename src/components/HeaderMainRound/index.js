/* eslint-disable react/prop-types */
import React from "react";
// import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import styles from "./styles.module.scss";

function HeaderMainRound({ turn, groupSize }) {
  return (
    <div className={styles.progressInfoContainer}>
      <span>
        {" "}
        <FormattedMessage id="roundCardInfo.turn" />
      </span>
      <div className={styles.progressMainInfo}>
        <p>{Number.isNaN(turn) ? 0 : turn}</p>
        <p>/{Number.isNaN(groupSize) ? 0 : groupSize}</p>
      </div>
    </div>
  );
}

// HeaderMainRound.propTypes = {
//   turn: PropTypes.number.isRequired,
//   groupSize: PropTypes.number.isRequired,
// };

export default HeaderMainRound;
