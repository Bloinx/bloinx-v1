import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import getTokenBLX from "../../api/getTokenBalance";
import styles from "./styles.module.scss";
import { MainContext } from "../../providers/provider";

const TokenBalance = ({ currentProvider }) => {
  const [BLXToken, setBLXToken] = useState(0);
  const { currentAddress } = useContext(MainContext);

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
  currentProvider: PropTypes.string,
};

TokenBalance.defaultProps = {
  currentProvider: undefined,
};

const mapStateToProps = (state) => {
  const currentProvider = state?.main?.currentProvider;
  return { currentProvider };
};

export default connect(mapStateToProps, null)(TokenBalance);
