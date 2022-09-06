import React, { useContext } from "react";

export const RoundsContext = React.createContext({});

export const useRoundContext = () => useContext(RoundsContext);
