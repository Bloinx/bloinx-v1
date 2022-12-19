import React, { useState, useEffect, useContext } from "react";
import getTokenBLX from "../../api/getTokenBalance";
import styles from "./styles.module.scss";
import { MainContext } from "../../providers/provider";

const TokenBalance = () => {
  const [BLXToken, setBLXToken] = useState(0);
  const { currentAddress, currentProvider } = useContext(MainContext);

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

export default TokenBalance;
