/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { Button, Form, Input, notification } from "antd";

import logo from "../../assets/bloinxLogo.png";
import styles from "./index.module.scss";
import { useAuth } from "../../hooks/useAuth";

function UpdatePass() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const intl = useIntl();
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
        openNotificationWithIcon(
          "warning",
          `${intl.formatMessage({
            id: "updatePass.notification",
          })}`,
          ""
        );
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
          openNotificationWithIcon(
            "error",
            `${intl.formatMessage({
              id: "updatePass.functions.updatePassword.onFailure.title",
            })}`,
            `${intl.formatMessage({
              id: "updatePass.functions.updatePassword.onFailure.text",
            })}`
          );
          setLoading(false);
        },
      }).then(() => {
        openNotificationWithIcon(
          "success",
          `${intl.formatMessage({
            id: "updatePass.functions.updatePassword.onSuccess.title",
          })}`,
          `${intl.formatMessage({
            id: "updatePass.functions.updatePassword.onSuccess.text",
          })}`
        );
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
            <span className={styles.UpdatePass_Title}>
              {intl.formatMessage({
                id: "updatePass.title",
              })}
            </span>
          </div>
          <Form
            layout="vertical"
            onFinish={(values) => {
              updatePasswordSubmit(values);
            }}
          >
            <Form.Item
              name="password"
              label={`${intl.formatMessage({
                id: "updatePass.form.label.password",
              })}`}
              rules={[
                {
                  required: true,
                  message: `${intl.formatMessage({
                    id: "updatePass.form.validation.required",
                  })}`,
                },
                {
                  min: 6,
                  message: `${intl.formatMessage({
                    id: "updatePass.form.validation.minlength",
                  })}`,
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Your password" />
            </Form.Item>

            <Form.Item
              name="ConfirmPassword"
              label={`${intl.formatMessage({
                id: "updatePass.form.label.confirmPassword",
              })}`}
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: `${intl.formatMessage({
                    id: "updatePass.form.validation.requiredConfirm",
                  })}`,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        `${intl.formatMessage({
                          id: "updatePass.form.validation.notEqual",
                        })}`
                      )
                    );
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder={`${intl.formatMessage({
                  id: "updatePass.form.placeholder.confirmPassword",
                })}`}
              />
            </Form.Item>

            <Form.Item>
              <Button block type="primary" htmlType="submit">
                {`${intl.formatMessage({
                  id: "updatePass.buttonText",
                })}`}
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.UpdatePass_Card_Options}>
          <div>{`${intl.formatMessage({
            id: "updatePass.actions.subtitle",
          })}`}</div>
          <div>
            <Link to="/login">{`${intl.formatMessage({
              id: "updatePass.actions.login",
            })}`}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePass;
