import React, { useState, useContext } from "react";
import { useIntl } from "react-intl";
import { WalletOutlined } from "@ant-design/icons";
import { Button, Drawer, Typography, Spin, Result, Card } from "antd";
import NETWORKS from "../../constants/networks";
import { useWallet } from "../../hooks/useWallet";
import { MainContext } from "../../providers/provider";
import config, { walletConnect } from "../../api/config.main.web3";

import styles from "./styles.module.scss";

const { Title } = Typography;

function Wallets() {
  const { connect, userWallet, account } = useWallet();
  const {
    setCurrentProvider,
    setCurrentAddress,
    setContractInstance,
    setWallet,
  } = useContext(MainContext);
  const [accountData, setAccountData] = useState({
    publicAddress: null,
    originalAdress: null,
  });
  const [networkSelected, setNetworkSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const intl = useIntl();

  const handleToggleDrawer = () => setOpen(!open);

  const connectMMWallet = async () => {
    try {
      setLoading(true);
      await connect("Metamask", NETWORKS[networkSelected]);
      setAccountData({
        publicAddress: userWallet(),
        originalAdress: await account(),
      });
      await config();
      setLoading(false);
      handleToggleDrawer();
    } catch (err) {
      console.log("Ocurrio un Error: ", err);
      setError(err);
      setLoading(false);
      handleToggleDrawer();
    }
  };

  const connectWalletConnect = async () => {
    try {
      setLoading(true);
      await connect("walletconnect", NETWORKS[networkSelected]);
      setAccountData({
        publicAddress: userWallet(),
        originalAdress: await account(),
      });
      await walletConnect();
      setLoading(false);
      handleToggleDrawer();
    } catch (err) {
      console.log("Ocurrio un Error: ", err);
      setError(err);
      setLoading(false);
      handleToggleDrawer();
    }
  };

  const handleReset = async () => {
    try {
      setAccountData({ publicAddress: null, originalAdress: null });
      localStorage.removeItem("user_address");
      console.log("Disconnect...");
      if (!window.ethereum?.isMetaMask) {
        const { provider } = await walletConnect();
        await provider.disconnect();
      }
      setContractInstance(null);
      setCurrentAddress(null);
      setCurrentProvider(null);
      setWallet(null);
      window.location.reload();
    } catch (err) {
      console.log("ERR: ", err);
    }
  };

  const selectNetwork = (e) => {
    setNetworkSelected(e);
  };

  const errorData = "Ocurrio un error"; // errorMessages.find((item) => item.code === error) || {};
  const options =
    errorData.hrefs &&
    errorData.hrefs.map((item) => (
      <a target="_blank" href={item.url} rel="noreferrer">
        <Button type="ghost">{item.title}</Button>
      </a>
    ));

  return (
    <div>
      {accountData.publicAddress &&
        accountData.publicAddress.startsWith("0X") &&
        !loading && (
          <Button
            type="primary"
            shape="round"
            onClick={handleReset}
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src={NETWORKS[networkSelected].icon}
              alt="bloinx-icon"
              width="20"
            />
            &nbsp;&nbsp;{accountData.publicAddress}
          </Button>
        )}

      {!accountData.publicAddress && (
        <Button type="primary" shape="round" onClick={handleToggleDrawer}>
          {`${intl.formatMessage({
            id: "wallets.actions.connect",
          })}`}
        </Button>
      )}

      {loading && <Spin size="medium" />}

      {!networkSelected && (
        <Drawer
          title="Select Network"
          visible={open}
          placement="right"
          closable
          onClose={handleToggleDrawer}
          width={400}
        >
          <div className={styles.chainContainer}>
            {Object.keys(NETWORKS).map((network) => {
              return (
                <Card
                  className={styles.cardChain}
                  style={{
                    width: 120,
                    height: 128,
                    cursor: "pointer",
                  }}
                  key={NETWORKS[network].chainId}
                  onClick={() => selectNetwork(network)}
                >
                  <img
                    src={NETWORKS[network].icon}
                    alt={NETWORKS[network].name}
                    width="58"
                    height={58}
                    style={{ paddingTop: "10px" }}
                  />
                  <p className={styles.chainNameContainer}>
                    {NETWORKS[network].name}
                  </p>
                </Card>
              );
            })}
          </div>
        </Drawer>
      )}

      {networkSelected && (
        <Drawer
          title={`${intl.formatMessage({
            id: "wallets.title",
          })}`}
          visible={open}
          placement="right"
          closable
          onClose={handleToggleDrawer}
          width={400}
        >
          <div className={styles.Loading}>
            <Title level={5}>{`${intl.formatMessage({
              id: "wallets.subtitle",
            })}`}</Title>
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
          {(networkSelected === "44787" || networkSelected === "42220") && (
            <div className={styles.Loading}>
              <Title level={5}>{`${intl.formatMessage({
                id: "wallets.subtitleValora",
              })}`}</Title>
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
      )}
    </div>
  );
}

export default Wallets;
