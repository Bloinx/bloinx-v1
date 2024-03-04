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
        <p>{turn !== 0 && !Number.isNaN(turn) ? turn : "1"}</p>
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
