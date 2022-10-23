import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const MainContext = createContext({
  contractInstance: null,
  currentAddress: null,
  currentProvider: null,
});

const MainProvider = ({ children }) => {
  const [contractInstance, setContractInstance] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [currentProvider, setCurrentProvider] = useState(null);

  return (
    <MainContext.Provider
      value={{
        contractInstance,
        setContractInstance,
        currentAddress,
        setCurrentAddress,
        currentProvider,
        setCurrentProvider,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default MainProvider;
