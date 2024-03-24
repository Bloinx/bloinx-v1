import { ethers } from "ethers";

// Direcciones de los contratos de los tokens en Polygon
const tokenAddresses = [
  { address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", symbol: "USDC" },
  { address: "0xBD1fe73e1f12bD2bc237De9b626F056f21f86427", symbol: "jMXN" },
  { address: "0xa411c9aa00e020e4f88bc19996d29c5b7adb4acf", symbol: "XOC" },
];

const tokenTestAddresses = [
  { address: "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23", symbol: "USDC" },
  { address: "0x04Daba108d3E45A256ED36aDD8D8744b48cb0E41", symbol: "jMXN" },
  { address: "0xa411c9Aa00E020e4f88Bc19996d29c5B7ADB4ACf", symbol: "XOC" },
];

const erc20Abi = [
  "function balanceOf(address) view returns (uint)",
  "function decimals() view returns (uint8)",
  "function name() view returns (string)",
];

export default async function getERC20TokenBalance(walletAddress, providerId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const addressList = providerId === 137 ? tokenAddresses : tokenTestAddresses;

  const balancePromises = addressList.map(async (token) => {
    const contract = new ethers.Contract(token.address, erc20Abi, provider);
    try {
      const [balance, decimals] = await Promise.all([
        contract.balanceOf(walletAddress),
        contract.decimals(),
      ]);

      const formattedBalance = ethers.utils.formatUnits(balance, decimals);
      return { name: token.symbol, balance: formattedBalance };
    } catch (error) {
      console.error(`Error al obtener el balance de ${token.symbol}: `, error);
      return null;
    }
  });

  const balances = await Promise.all(balancePromises);

  return balances.filter((balance) => balance !== null);
}
