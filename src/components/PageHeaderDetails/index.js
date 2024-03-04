/* eslint-disable react/prop-types */

import React from "react";
import PropTypes from "prop-types";
import { Typography, Flex } from "antd";

import styles from "./styles.module.scss";
import HeaderMainRound from "../HeaderMainRound";

const { Title } = Typography;

const PageHeaderDetails = ({ title, action, turn, groupSize, showDetails }) => {
  return (
    <div className={styles.PageHeaderDetails}>
      <Flex vertical>
        <span>Ronda</span>
        <Title level={4} className={styles.dashboardTitle}>
          {title}
        </Title>
      </Flex>
      {showDetails && (
        <>
          <div className={styles.verticalLine} />
          <HeaderMainRound turn={turn} groupSize={groupSize} />
        </>
      )}
      {action}
    </div>
  );
};

PageHeaderDetails.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
  action: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.node,
  ]),
  turn: PropTypes.number,
  groupSize: PropTypes.number,
  showDetails: PropTypes.bool,
};

PageHeaderDetails.defaultProps = {
  action: "",
  showDetails: false,
  title: "",
  turn: 0,
  groupSize: 0,
};

export default PageHeaderDetails;
