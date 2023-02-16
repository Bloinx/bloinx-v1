/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  notification,
  Space,
} from "antd";
import apiUserData from "../../api/setUserData";

import logo from "../../assets/bloinxLogo.png";
import styles from "./index.module.scss";
import { useAuth } from "../../hooks/useAuth";

function UpdatePass() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, title, text) => {
    api[type]({
      message: title,
      description: text,
    });
  };

  useEffect(() => {
    const hashData = window.location.hash;
    setHash(hashData);
  }, []);

  const { updatePassword } = useAuth();
  const updatePasswordSubmit = (values) => {
    if (!hash) {
      history.push("/login");
    } else if (hash) {
      const hashArr = hash
        .substring(1)
        .split("&")
        .map((item) => item.split("="));
      console.log(hashArr);
      let type;
      let accessToken;
      hashArr.forEach(([key, value]) => {
        if (key === "type") {
          type = value;
        } else if (key === "access_token") {
          accessToken = value;
        }
      });

      if (type !== "recovery" || !accessToken || accessToken === "object") {
        openNotificationWithIcon("warning", "Session expired", "");
        // history.push("/login");
      }
      setLoading(true);
      updatePassword({
        values,
        accessToken,
        onSuccess: () => {
          // apiUserData(data, values);
          setLoading(false);
        },
        onFailure: (err) => {
          openNotificationWithIcon("error", "Ups!", "Something went wrong");
          setLoading(false);
        },
      }).then(() => {
        openNotificationWithIcon("success", "Success!", "Password updated");
        setTimeout(() => {
          history.push("/login");
        }, 2000);
      });
    }
  };

  return (
    <div className={styles.UpdatePass}>
      {contextHolder}
      <div className={styles.UpdatePass_Card}>
        <div className={styles.UpdatePass_Card_Content}>
          <div className={styles.UpdatePass_Card_Content_Header}>
            <img src={logo} alt="logo" className={styles.UpdatePass_Icon} />
            <span className={styles.UpdatePass_Title}>Reset Password</span>
          </div>
          <Form
            layout="vertical"
            onFinish={(values) => {
              updatePasswordSubmit(values);
            }}
          >
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Password is required",
                },
                {
                  min: 6,
                  message: "Minimun 6 characters",
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Your password" />
            </Form.Item>

            <Form.Item
              name="ConfirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Confirm password is required",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Confirm password is not matching with your password"
                      )
                    );
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Confirm your password" />
            </Form.Item>

            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.UpdatePass_Card_Options}>
          <div>Tambien puedes</div>
          <div>
            <Link to="/login">Iniciar sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePass;
