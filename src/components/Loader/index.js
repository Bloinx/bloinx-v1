/* eslint-disable react/prop-types */
import React from "react";
import { CubeSpinner } from "react-spinners-kit";
import { FormattedMessage } from "react-intl";

import styles from "./index.module.scss";

const Loader = ({ loadingMessage }) => (
  <div className={styles.Loader}>
    <CubeSpinner frontColor="#F58F98" size={30} />
    <p>
      {" "}
      <FormattedMessage id={loadingMessage} />
    </p>
  </div>
);

export default React.memo(Loader);
