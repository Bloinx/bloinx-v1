import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentWallet, getCurrentProvider } from "../../redux/actions/main";
import styles from "./styles.module.scss";

const TokenBalance = ({ currentAddressWallet, currentProvider }) => {
  const [BLXToken, setBLXToken] = useState(0);

  useEffect(() => {
    setBLXToken(0);
    console.log(currentAddressWallet);
    console.log(currentProvider);
  }, [currentAddressWallet]);

  return (
    <div className={styles.BalanceContent}>
      <p>{BLXToken} BLX</p>
    </div>
  );
};

TokenBalance.defaultProps = {
  currentAddressWallet: () => {},
  currentProvider: () => {},
};

TokenBalance.propTypes = {
  currentAddressWallet: PropTypes.func,
  currentProvider: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  currentAddressWallet: (address) => dispatch(getCurrentWallet(address)),
  currentProvider: (provider) => dispatch(getCurrentProvider(provider)),
});

export default connect(null, mapDispatchToProps)(TokenBalance);
