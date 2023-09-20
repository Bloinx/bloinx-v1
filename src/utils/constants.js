export const MAIN_FACTORY_ALFAJORES =
  "0xd53E64384Aa1aa736e4B2FD8143D901EFB9CBa8B";

export const MAIN_FACTORY_CELO_MAINNET =
  "0xfF0e77E52bC1B21F4b4CE6d77ac48E3f9abdb5fE";

export const MAIN_FACTORY_MUMBAI = "0xC0Bb95455480C17D8136c1255e7fF06f915d3Dd6";

export const MAIN_FACTORY_POLYGON =
  "0x7D69E4A1e8da9D19FC63836F0acAD2052146F202";

export const selectContractAddress = (network) => {
  if (network === 42220) {
    return MAIN_FACTORY_CELO_MAINNET;
  }
  if (network === 44787) {
    return MAIN_FACTORY_ALFAJORES;
  }
  if (network === 137) {
    return MAIN_FACTORY_POLYGON;
  }
  return MAIN_FACTORY_MUMBAI;
};

export const ALFAJORES_RPC_URL = "https://alfajores-forno.celo-testnet.org";
export const CELO_MAINNET_RPC_URL = "https://forno.celo.org";

export const RoundState = ["ON_ROUND_ACTIVE", "ON_REGISTER_STAGE"];
export const HistoryState = ["ON_ROUND_FINISHED", "ON_EMERGENCY_STAGE"];
