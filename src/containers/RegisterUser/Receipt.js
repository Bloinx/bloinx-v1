/* eslint-disable react/prop-types */

import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Receipt = ({
  handleGetRounds,
  currentProvider,
  wallet,
  currentAddress,
}) => {
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await handleGetRounds(currentAddress, currentProvider, wallet);

        history.push("/dashboard");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return <div style={{ color: "white" }}>Registro con éxito</div>;
};

export default Receipt;
