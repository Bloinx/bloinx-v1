import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

import styles from "./styles.module.scss";
import { ButtonAction } from "../styles";

function ButtonOnlyOneStep({ type, onClick, disabled, label, loading }) {
  return (
    <div className={styles.ButtonOnlyOneStep}>
      <ButtonAction
        loading={loading}
        htmlType={type}
        type="primary"
        size="large"
        onClick={onClick}
        disabled={disabled}
      >
        {label || <FormattedMessage id="commons.buttons.continue" />}
      </ButtonAction>
    </div>
  );
}

ButtonOnlyOneStep.defaultProps = {
  disabled: false,
  loading: false,
  type: "button",
  label: "",
  onClick: () => {},
};

ButtonOnlyOneStep.propTypes = {
  loading: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};

export default ButtonOnlyOneStep;
