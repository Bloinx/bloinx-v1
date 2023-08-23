/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { Button } from "antd";
import { FormattedMessage, useIntl } from "react-intl";

import logo from "../../assets/bloinxLogo.png";
import { validateEmail, validatePassword } from "./vlidators";
import styles from "./index.module.scss";
import { useAuth } from "../../hooks/useAuth";
import useLocalStorage from "../../hooks/useLocalStorage";

const errors = {
  "auth/user-not-found": "El usuario no existe.",
};

function Login() {
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
  const [storedValue] = useLocalStorage("supabase.auth.token", null);
  const intl = useIntl();

  const { signIn } = useAuth();
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    setLoading(true);
    signIn({
      userLogin: email,
      password,
      onSuccess: (data) => {
        // saveUser(data);
        setLoading(false);
        history.push("/dashboard");
      },
      onFailure: (er) => {
        setLoading(false);
        setError(true);
        setErrorMessage(
          `${intl.formatMessage({
            id: "login.form.validation.onFail",
          })}`
        );
      },
    });
  };

  const handlePasswordChange = (e) => {
    const {
      target: { value },
    } = e;
    const validationpasswordError = validatePassword(value, intl);
    setPasswordError(validationpasswordError !== null);
    setIsDisabled(validationpasswordError !== null);
    if (validationpasswordError) {
      setPasswordErrorMessage(validationpasswordError);
    }
    setPassword(value);
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
    if (storedValue !== null) {
      history.push("/dashboard");
    }
  }, [storedValue]);

  useEffect(() => {
    if (email.length !== 0 && password.length !== 0) {
      isDisabled(true);
    }
  }, []);

  return (
    <div className={styles.Login}>
      <div className={styles.Login_Card}>
        <div className={styles.Login_Card_Content}>
          <div className={styles.Login_Card_Content_Header}>
            <img src={logo} alt="logo" className={styles.Login_Icon} />
            <span className={styles.Login_Title}>
              {" "}
              <FormattedMessage id="login.title" />
            </span>
          </div>
          <form className={styles.Login_Card_Content_Form}>
            <span>
              {" "}
              <FormattedMessage id="login.form.label.email" />
            </span>
            <input
              className={styles.Login_Input}
              name="user"
              type="email"
              value={email}
              onChange={handleEmailChange}
              disabled={loading}
            />
            <span className={styles.error}>
              {emailError ? emailErrorMessage : ""}
            </span>
            <span>
              {" "}
              <FormattedMessage id="login.form.label.password" />
            </span>
            <input
              className={styles.Login_Input}
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              disabled={loading}
            />
            <span className={styles.error}>
              {passwordError ? passwordErrorMessage : ""}
            </span>
          </form>
          <span className={styles.Login_Card_Content_forgotPass}>
            <Link to="/forgotpass">
              <FormattedMessage id="login.actions.forgotPassword" />
            </Link>
          </span>
          <div className={styles.Login_Card_Content_Actions}>
            <span className={styles.error}>{error ? errorMessage : ""}</span>
            <Button
              loading={loading}
              disabled={isDisabled}
              type="primary"
              onClick={handleLogin}
            >
              <FormattedMessage id="login.actions.login" />
            </Button>
          </div>
        </div>
        <div className={styles.Login_Card_Options}>
          <div>
            <FormattedMessage id="login.subtitle" />
          </div>
          <div>
            <Link to="/signup">
              <FormattedMessage id="login.actions.register" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
