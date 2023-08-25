/* eslint-disable import/prefer-default-export */
import { useContext, useEffect, useState } from "react";
// import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { walletconnect } from "../constants/web3Providers";
import { MainContext } from "../providers/provider";
import { iOS } from "../utils/browser";
import getFunds from "../api/getFunds";

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
  const { setCurrentAddress, setCurrentProvider, setWallet, setFunds } =
    useContext(MainContext);
  const [userData, setUserData] = useState();

  useEffect(() => {
    if (userData && window.ethereum !== undefined) {
      const fetchBalance = async () => {
        const balance = await getFunds(userData.address, userData.chainId);
        setFunds(balance);
      };

      fetchBalance();
    }
  }, [userData, window.ethereum]);

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

  const connect = async (walletName, network, setAccountData) => {
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

          setCurrentProvider(network.chainId);
          setWallet("Metamask");
          setCurrentAddress(provider.selectedAddress);
        }

        setUserData({
          name: walletName,
          chainId: network.chainId,
          address: provider.selectedAddress,
        });
        setAccountData({
          publicAddress: `${provider.selectedAddress?.slice(
            0,
            4
          )}...${provider.selectedAddress?.slice(
            provider.selectedAddress.length - 4,
            provider.selectedAddress.length
          )}`.toUpperCase(),
          originalAdress: await account(),
        });

        localStorage.setItem(
          "user_address",
          JSON.stringify({
            name: walletName,
            chainId: network.chainId,
            address: provider.selectedAddress,
          })
        );
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
        setCurrentAddress(provider.accounts[0]);
        localStorage.setItem(
          "user_address",
          JSON.stringify({
            name: walletName,
            chainId: network.chainId,
            address: provider.accounts[0],
          })
        );
        setUserData({
          name: walletName,
          chainId: network.chainId,
          address: provider.selectedAddress,
        });
      }

      const chain = network;
      chain.provider = provider;

      // setAccountData({
      //   publicAddress: userWallet(),
      //   originalAdress: await account(),
      // });
    } catch (error) {
      console.error("Error: ", error);
      throw new Error(error);
    }
  };

  return { connect, userWallet, account, setUserData };
};
