/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";

import logo from "../../assets/bloinxLogo.png";
import validateEmail from "./vlidators";
import styles from "./index.module.scss";
import { useAuth } from "../../hooks/useAuth";
import { ButtonAction, LinkStyled } from "../../components/styles";

function ForgotPass() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const intl = useIntl();
  const { ResetPass } = useAuth();
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPass = () => {
    setLoading(true);
    ResetPass({
      emailReset: email,
      onSuccess: (data) => {
        // saveUser(data);
        setLoading(false);
        // history.push("/update-password");
      },
      onFailure: (er) => {
        if (er) {
          setLoading(false);
          setError(true);
          setErrorMessage(
            `${intl.formatMessage({
              id: "ForgotPass.form.validation.onFail",
            })}`
          );
        }
      },
    });
  };

  const handleEmailChange = (e) => {
    const {
      target: { value },
    } = e;
    const validationError = validateEmail(value, intl);
    setEmailError(validationError !== null);
    setIsDisabled(validationError !== null);
    if (validationError) {
      setEmailErrorMessage(validationError);
    }
    setEmail(value);
  };

  useEffect(() => {
    if (email.length !== 0 && password.length !== 0) {
      isDisabled(true);
    }
  }, []);

  return (
    <div className={styles.ForgotPass}>
      <div className={styles.ForgotPass_Card}>
        <div className={styles.ForgotPass_Card_Content}>
          <div className={styles.ForgotPass_Card_Content_Header}>
            <img src={logo} alt="logo" className={styles.ForgotPass_Icon} />
            <span className={styles.ForgotPass_Title}>
              {" "}
              <FormattedMessage id="ForgotPass.title" />
            </span>
          </div>
          <div className={styles.ForgotPass_Card_Content_Form}>
            <div>
              <FormattedMessage id="ForgotPass.subtitle" />
            </div>
            <span>
              {" "}
              <FormattedMessage id="ForgotPass.form.label.email" />
            </span>
            <input
              className={styles.ForgotPass_Input}
              name="user"
              type="email"
              value={email}
              onChange={handleEmailChange}
              disabled={loading}
            />
            <span className={styles.error}>
              {emailError ? emailErrorMessage : ""}
            </span>
          </div>
          <div className={styles.ForgotPass_Card_Content_Actions}>
            <span className={styles.error}>{error ? errorMessage : ""}</span>
            <ButtonAction
              loading={loading}
              type="primary"
              disabled={isDisabled}
              onClick={handleForgotPass}
            >
              <FormattedMessage id="ForgotPass.actions.reset" />
            </ButtonAction>
          </div>
        </div>
        <div className={styles.ForgotPass_Card_Options}>
          <div className={styles.ForgotPass_Card_Options_Grid}>
            <LinkStyled to="/signup">
              <FormattedMessage id="ForgotPass.actions.register" />
            </LinkStyled>
            <span className={styles.ForgotPass_Card_Content_Divider}> | </span>
            <LinkStyled to="/login">
              <FormattedMessage id="ForgotPass.actions.login" />
            </LinkStyled>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPass;
