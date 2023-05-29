/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";

import { Button, Form, Input, Select, Row, Col } from "antd";
import apiUserData from "../../api/setUserData";

import logo from "../../assets/bloinxLogo.png";
import styles from "./index.module.scss";
import { useAuth } from "../../hooks/useAuth";

function SignUp() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const intl = useIntl();

  const registerUser = (values) => {
    setLoading(true);
    signUp({
      values,
      onSuccess: (data) => {
        apiUserData(data, values);

        setLoading(false);
        history.push("/dashboard");
      },
      onFailure: (err) => {
        setLoading(false);
      },
    });
  };

  return (
    <div className={styles.SignUp}>
      <div className={styles.SignUp_Card}>
        <div className={styles.SignUp_Card_Content}>
          <div className={styles.SignUp_Card_Content_Header}>
            <img src={logo} alt="logo" className={styles.SignUp_Icon} />
            <span className={styles.SignUp_Title}>
              <FormattedMessage id="signup.title" />
            </span>
          </div>
          <Form
            layout="vertical"
            onFinish={(values) => {
              registerUser(values);
            }}
          >
            <Row gutter={10}>
              <Col span={12}>
                <FormattedMessage id="signup.form.input.email.label">
                  {(message) => (
                    <Form.Item
                      name="email"
                      label={message}
                      rules={[
                        {
                          required: true,
                          message: `${intl.formatMessage({
                            id: "signup.form.input.email.error.required",
                          })}`,
                        },
                        {
                          type: "email",
                          message: `${intl.formatMessage({
                            id: "signup.form.input.email.error.type",
                          })}`,
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        placeholder={`${intl.formatMessage({
                          id: "signup.form.input.email.placeholder",
                        })}`}
                      />
                    </Form.Item>
                  )}
                </FormattedMessage>
              </Col>
              <Col span={12}>
                <FormattedMessage id="signup.form.input.username.label">
                  {(message) => (
                    <Form.Item
                      name="username"
                      label={message}
                      rules={[
                        {
                          required: true,
                          message: `${intl.formatMessage({
                            id: "signup.form.input.username.error.required",
                          })}`,
                        },
                        {
                          type: "text",
                          message: `${intl.formatMessage({
                            id: "signup.form.input.username.error.whitespace",
                          })}`,
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        placeholder={`${intl.formatMessage({
                          id: "signup.form.input.username.placeholder",
                        })}`}
                      />
                    </Form.Item>
                  )}
                </FormattedMessage>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label={`${intl.formatMessage({
                    id: "signup.form.input.password.label",
                  })}`}
                  rules={[
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: "signup.form.input.password.error.required",
                      })}`,
                    },
                    {
                      min: 6,
                      message: `${intl.formatMessage({
                        id: "signup.form.input.password.error.minlength",
                      })}`,
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    placeholder={`${intl.formatMessage({
                      id: "signup.form.input.password.placeholder",
                    })}`}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ConfirmPassword"
                  label={`${intl.formatMessage({
                    id: "signup.form.input.confirmPassword.label",
                  })}`}
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: "signup.form.input.confirmPassword.error.required",
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
                              id: "signup.form.input.confirmPassword.error.notEqual",
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
                      id: "signup.form.input.confirmPassword.placeholder",
                    })}`}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item
                  name="yearsOld"
                  label={`${intl.formatMessage({
                    id: "signup.form.input.age.label",
                  })}`}
                  rules={[
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: "signup.form.input.age.error.required",
                      })}`,
                    },
                    () => ({
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject();
                        }
                        if (value.isNaN) {
                          return Promise.reject(
                            new Error(
                              `${intl.formatMessage({
                                id: "signup.form.input.age.error.type",
                              })}`
                            )
                          );
                        }
                        if (value < 18) {
                          return Promise.reject(
                            new Error(
                              `${intl.formatMessage({
                                id: "signup.form.input.age.error.min",
                              })}`
                            )
                          );
                        }
                        if (value > 130) {
                          return Promise.reject(
                            new Error(
                              `${intl.formatMessage({
                                id: "signup.form.input.age.error.max",
                              })}`
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <Input
                    placeholder={`${intl.formatMessage({
                      id: "signup.form.input.age.placeholder",
                    })}`}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label={`${intl.formatMessage({
                    id: "signup.form.input.gender.label",
                  })}`}
                  requiredMark={`${intl.formatMessage({
                    id: "signup.form.input.gender.required",
                  })}`}
                >
                  <Select>
                    <Select.Option
                      value={`${intl.formatMessage({
                        id: "signup.form.input.gender.options.option1",
                      })}`}
                    >{`${intl.formatMessage({
                      id: "signup.form.input.gender.options.option1",
                    })}`}</Select.Option>
                    <Select.Option
                      value={`${intl.formatMessage({
                        id: "signup.form.input.gender.options.option2",
                      })}`}
                    >{`${intl.formatMessage({
                      id: "signup.form.input.gender.options.option2",
                    })}`}</Select.Option>
                    <Select.Option
                      value={`${intl.formatMessage({
                        id: "signup.form.input.gender.options.option3",
                      })}`}
                    >{`${intl.formatMessage({
                      id: "signup.form.input.gender.options.option3",
                    })}`}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button block type="primary" htmlType="submit">
                {`${intl.formatMessage({
                  id: "signup.actions.submit",
                })}`}
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.SignUp_Card_Options}>
          <div>
            {" "}
            {`${intl.formatMessage({
              id: "signup.subtitle",
            })}`}
          </div>
          <div>
            <Link to="/login">{`${intl.formatMessage({
              id: "signup.actions.login",
            })}`}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
