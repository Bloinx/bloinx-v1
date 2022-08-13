import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import getTokenBLX from "../../api/getTokenBalance";
import styles from "./styles.module.scss";

const TokenBalance = ({ currentAddress, currentProvider }) => {
  const [BLXToken, setBLXToken] = useState(0);

  useEffect(() => {
    const getBalance = async () => {
      const result = await getTokenBLX(currentAddress, currentProvider);
      setBLXToken(result);
    };

    if (currentAddress === null) {
      setBLXToken(0);
    } else {
      getBalance().catch((error) => console.error(error));
    }
  }, [currentAddress, currentProvider]);

  return (
    <div className={styles.BalanceContent}>
      <p>{BLXToken} BLX</p>
    </div>
  );
};

TokenBalance.propTypes = {
  currentAddress: PropTypes.string,
  currentProvider: PropTypes.string,
};

TokenBalance.defaultProps = {
  currentAddress: undefined,
  currentProvider: undefined,
};

const mapStateToProps = (state) => {
  const currentAddress = state?.main?.currentAddress;
  const currentProvider = state?.main?.currentProvider;
  return { currentAddress, currentProvider };
};

export default connect(mapStateToProps, null)(TokenBalance);
