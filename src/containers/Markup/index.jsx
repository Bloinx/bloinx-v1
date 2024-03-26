import React, { useState } from "react";
import { useLocation, Redirect } from "react-router-dom"; // Import Redirect
import { Layout } from "antd";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

import Navbar from "../../components/Navbar";
import NavAside from "../../components/NavAside";
import useWindowDimensions from "../../utils/useWindowDimensions";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/Loader";

const { Header, Content, Footer } = Layout;

function Markup({ children }) {
  const { width } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const { user, loading } = useAuth();
  const location = useLocation();
  const currentRoute = location.pathname;

  const toggleDrawer = (status) => {
    setVisible(status !== undefined ? !visible : status);
  };

  if (loading) {
    return <Loader />;
  }

  if (!user && currentRoute !== "/login") {
    return <Redirect to="/login" />;
  }

  return user ? (
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
};

export default Markup;
