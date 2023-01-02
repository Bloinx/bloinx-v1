import React, { useState } from "react";
import { WalletOutlined } from "@ant-design/icons";
import { Button, Drawer, Typography, Spin, Result } from "antd";
import NETWORKS from "../../constants/networks";
import { useWallet } from "../../hooks/useWallet";

// import config, { walletConnect } from "../../api/config.main.web3";
import styles from "./styles.module.scss";

const { Title } = Typography;

function Wallets() {
  const { connect, userWallet, disconnect, account } = useWallet();
  const [accountData, setAccountData] = useState({
    publicAddress: userWallet(),
    originalAdress: account(),
  });
  const [networkSelected, setNetworkSelected] = useState({
    chainId: null,
    name: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const handleToggleDrawer = () => setOpen(!open);

  const connectMMWallet = async () => {
    try {
      setLoading(true);
      await connect("Metamask", NETWORKS[1]);
      setLoading(false);
      handleToggleDrawer();
    } catch (err) {
      console.log("Ocurrio un Error: ", err);
      setError(err);
    }
  };

  const connectWalletConnect = async () => {
    try {
      setLoading(true);
      await connect("walletconnect", NETWORKS[1]);
      setLoading(false);
      handleToggleDrawer();
    } catch (err) {
      console.log("Ocurrio un Error: ", err);
      setError(err);
    }
  };

  const handleReset = async () => {
    setAccountData({ publicAddress: null, originalAdress: null });
    try {
      await disconnect();
    } catch (err) {
      console.log("ERR: ", err);
    }
    // if (!window.ethereum?.isMetaMask) {
    //   const { provider } = await walletConnect();
    //   await provider.disconnect();
    // }
    // setError(null);
    // window.location.reload();
  };

  const errorData = "Ocurrio un error"; // errorMessages.find((item) => item.code === error) || {};
  const options =
    errorData.hrefs &&
    errorData.hrefs.map((item) => (
      <a target="_blank" href={item.url} rel="noreferrer">
        <Button type="ghost">{item.title}</Button>
      </a>
    ));

  console.log({ accountData });
  return (
    <div>
      {accountData.publicAddress &&
        accountData.publicAddress.startsWith("0X") &&
        !loading && (
          <Button type="primary" shape="round" onClick={handleReset}>
            {accountData.publicAddress}
          </Button>
        )}

      {!accountData.publicAddress && (
        <Button type="primary" shape="round" onClick={handleToggleDrawer}>
          Conecta Tu Wallet
        </Button>
      )}

      {loading && <Spin size="medium" />}

      <Drawer
        title={networkSelected.chainId ? "My Wallet" : "Select Network"}
        visible={open}
        placement="right"
        closable
        onClose={handleToggleDrawer}
        width={400}
      >
        {!networkSelected.chainId &&
          !accountData.publicAddress &&
          NETWORKS.map((network) => {
            return (
              <div
                className={styles.Loading}
                style={{ marginTop: "20px", marginBottom: "10px" }}
              >
                <Button
                  key={network.chainId}
                  type="primary"
                  size="large"
                  shape="round"
                  onClick={() => setNetworkSelected(network.chainId)}
                >
                  {network.name}
                </Button>
              </div>
            );
          })}
        {networkSelected.chainId && (
          <>
            <div className={styles.Loading}>
              <Title level={5}>Elige tu Wallet dentro de Metamask</Title>
              {!loading && !error && (
                <Button
                  type="primary"
                  icon={<WalletOutlined />}
                  size="large"
                  shape="round"
                  onClick={connectMMWallet}
                >
                  METAMASK
                </Button>
              )}
              {loading && <Spin size="large" tip="Loading..." />}
            </div>
            <div className={styles.Loading}>
              <Title level={5}>Elige tu Wallet dentro de Valora</Title>
              {!loading && !error && (
                <Button
                  type="primary"
                  icon={<WalletOutlined />}
                  size="large"
                  shape="round"
                  onClick={connectWalletConnect}
                >
                  VALORA
                </Button>
              )}
              {loading && <Spin size="large" tip="Loading..." />}
            </div>
          </>
        )}
        {!loading && error && (
          <Result
            status={errorData.status}
            title={errorData.title}
            subTitle={errorData.description}
            extra={options}
          />
        )}
      </Drawer>
    </div>
  );
}

export default Wallets;
