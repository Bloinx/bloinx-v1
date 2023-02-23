import React, { useState, useEffect, useContext } from "react";
import getTokenBLX from "../../api/getTokenBalance";
import styles from "./styles.module.scss";
import { MainContext } from "../../providers/provider";

const TokenBalance = () => {
  const [BLXToken, setBLXToken] = useState(0);
  const { currentAddress, wallet, currentProvider } = useContext(MainContext);
  const [currentNetwork, setCurrentNetwork] = useState(null);

  useEffect(() => {
    const getBalance = async () => {
      const result = await getTokenBLX(currentAddress, wallet);
      setBLXToken(result);
    };
    setBLXToken(0);
    setCurrentNetwork(currentProvider?.networkVersion);
    if (
      currentAddress !== null &&
      (currentNetwork === "42220" || currentNetwork === "44787")
    ) {
      getBalance().catch((error) => console.error(error));
    }
  }, [currentAddress, wallet, currentProvider, currentNetwork]);

  return (
    <>
      {(currentNetwork === "42220" || currentNetwork === "44787") && (
        <div className={styles.BalanceContent}>
          <p>{BLXToken} BLX</p>
        </div>
      )}
    </>
  );
};

export default TokenBalance;
