import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "antd";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

import Navbar from "../../components/Navbar";
import NavAside from "../../components/NavAside";
// import getSavingGroupsMethods from "../../utils/getSGContract";
import useWindowDimensions from "../../utils/useWindowDimensions";
import { useAuth } from "../../hooks/useAuth";

const { Header, Content, Footer } = Layout;
function Markup({ children }) {
  const { width } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const { user, loading } = useAuth(); // Destructure to get user and loading
  const location = useLocation();
  const currentRoute = location.pathname;

  const toggleDrawer = (status) => {
    if (status) {
      setVisible(!visible);
    } else {
      setVisible(status);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  return user && currentRoute !== "/login" ? (
    <Layout className="appLayout">
      <NavAside width={width} toggleDrawer={toggleDrawer} visible={visible} />
      <Layout>
        <Header className="appHeader">
          <Navbar width={width} toggleDrawer={toggleDrawer} visible={visible} />
        </Header>
        <Content className="appSection">{children}</Content>
        <Footer className="appFooter">
          <FormattedMessage id="copyright" />
        </Footer>
      </Layout>
    </Layout>
  ) : null;
}

Markup.propTypes = {
  children: PropTypes.node.isRequired,
  // initialContractInstance: PropTypes.func.isRequired,
};

export default Markup;
