import React from "react";
import PropTypes from "prop-types";
import { Typography } from "antd";

import styles from "./styles.module.scss";

const { Title } = Typography;

const PageHeader = ({ title, action }) => {
  return (
    <div className={styles.PageHeader}>
      <Title level={4} className={styles.dashboardTitle}>
        {title}
      </Title>
      {action}
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.func])
    .isRequired,
  action: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.node,
  ]),
};

PageHeader.defaultProps = {
  action: "",
};

export default PageHeader;
