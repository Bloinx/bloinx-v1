/* eslint-disable import/prefer-default-export */
import { useContext } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { walletconnect } from "../constants/web3Providers";
import { MainContext } from "../providers/provider";
import { iOS } from "../utils/browser";

// const errorMessages = [
//   {
//     code: 503,
//     status: "warning",
//     title: "Servicio no disponible",
//     description:
//       "Metamask no se encuentra instalado en tu navegador, por favor instalalo desde su pagina oficial.",
//     hrefs: [
//       {
//         url: "https://metamask.io/",
//         title: "Ir al sitio",
//       },
//     ],
//   },
//   {
//     code: 502,
//     status: "warning",
//     title: "Implementacion erronea",
//     description:
//       "Metamask no se encuentra instalado en tu navegador, por favor instalalo desde su pagina oficial.",
//     hrefs: [
//       {
//         url: "https://metamask.io/",
//         title: "Ir al sitio",
//       },
//     ],
//   },
//   {
//     code: 500,
//     status: "error",
//     title: "No se pudo ejecutar",
//     description: "",
//     hrefs: [],
//   },
// ];

export const useWallet = () => {
  const { setCurrentAddress, setCurrentProvider, setWallet } =
    useContext(MainContext);
  const userData = localStorage.getItem("user_address");

  const account = () => {
    if (userData) {
      const { address } = JSON.parse(userData);
      return address;
    }
    return null;
  };

  const userWallet = () => {
    if (userData) {
      const { address } = JSON.parse(userData);
      const formatted = `${address?.slice(0, 4)}...${address?.slice(
        address.length - 4,
        address.length
      )}`.toUpperCase();
      return formatted;
    }
    return null;
  };

  const connect = async (walletName, network) => {
    try {
      let provider = await detectEthereumProvider();

      if (walletName === "Metamask") {
        await provider.enable();
        if (!provider) {
          console.warn("Web3 provider not found!");
          // Metamask no se encuentra instalado
        } else {
          await provider.request({
            method: "eth_requestAccounts",
          });

          switch (network.chainId) {
            case 137:
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x89" }],
              });
              break;
            case 80001:
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x13881" }],
              });
              break;
            case 44787:
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0xAEF3" }],
              });
              break;
            case 42220:
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0xA4EC" }],
              });
              break;
            default:
              console.log(`Not available chain ${network.id}`);
              break;
          }

          setCurrentProvider(Web3.givenProvider);
        }
        setWallet("Metamask");
      } else if (walletName === "walletconnect") {
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden" && iOS()) {
            localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
          }
        });
        provider = walletconnect(network.id, true);
        await provider.enable();

        setCurrentProvider(provider);
        setWallet("WalletConnect");
      }

      const chain = network;
      chain.provider = provider;
      setCurrentAddress(provider.selectedAddress);

      localStorage.setItem(
        "user_address",
        JSON.stringify({
          name: walletName,
          chainId: network.chainId,
          address: provider.selectedAddress,
        })
      );
    } catch (error) {
      console.error("Error: ", error);
      throw new Error(error);
    }
  };

  return { connect, userWallet, account };
};
