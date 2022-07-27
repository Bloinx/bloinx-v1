import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { getCurrentWallet, getCurrentProvider } from "../../redux/actions/main";
import styles from "./styles.module.scss";
import getTokenBLX from "../../api/getTokenBalance";

const TokenBalance = ({ currentAddress, currentProvider }) => {
  const [BLXToken, setBLXToken] = useState(0);

  useEffect(() => {
    if (currentAddress === null) {
      setBLXToken(0);
    } else {
      setBLXToken(getTokenBLX(currentAddress, currentProvider));
    }

    console.log(currentAddress);
    console.log(currentProvider);
  }, [currentAddress]);

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

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TokenBalance);

// TokenBalance.defaultProps = {
//   currentAddressWallet: () => {},
//   currentProvider: () => {},
// };

// TokenBalance.propTypes = {
//   currentAddressWallet: PropTypes.func,
//   currentProvider: PropTypes.func,
// };

// const mapDispatchToProps = (dispatch) => ({
//   currentAddressWallet: (address) => dispatch(getCurrentWallet(address)),
//   currentProvider: (provider) => dispatch(getCurrentProvider(provider)),
// });

// export default connect(null, mapDispatchToProps)(TokenBalance);
