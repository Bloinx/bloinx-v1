/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Button, Form, Input, Select, Row, Col } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import apiSignUp from "../../api/setSignUpSupabase";
import apiUserData from "../../api/setUserData";

import logo from "../../assets/bloinxLogo.png";
import styles from "./index.module.scss";
import saveUserAction from "./actions";

function SignUp({ saveUser }) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const registerUser = (values) => {
    setLoading(true);
    apiSignUp({
      values,
      onSuccess: (data) => {
        console.log(data);
        apiUserData(data, values);
        saveUser(data);
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
            <span className={styles.SignUp_Title}>Registro</span>
          </div>
          <Form
            layout="vertical"
            onFinish={(values) => {
              console.log(values);
              registerUser(values);
            }}
          >
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: "Please, type your email",
                    },
                    {
                      type: "email",
                      message: "Please, enter a valid email",
                    },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Your email" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    {
                      required: true,
                      message: "Please, type your username",
                    },
                    {
                      whitespace: true,
                      message: "Your username cannot be empty",
                    },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Your username" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
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
              </Col>
              <Col span={12}>
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
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="Name"
                  rules={[
                    {
                      required: true,
                      message: "Please, type your name",
                    },
                    {
                      whitespace: true,
                      message: "Your name cannot be empty",
                    },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Your name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="lastName"
                  rules={[
                    {
                      required: true,
                      message: "Please, type your Lastname",
                    },
                    {
                      whitespace: true,
                      message: "Your lastname cannot be empty",
                    },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Your lastname" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item
                  name="phoneNumber"
                  label="Phone"
                  requiredMark="optional"
                >
                  <Input placeholder="Your phone number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="gender" label="Gender" requiredMark="optional">
                  <Select>
                    <Select.Option value="Male">Male</Select.Option>
                    <Select.Option value="Female">Female</Select.Option>
                    <Select.Option value="Other">Other</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.SignUp_Card_Options}>
          <div>Tambien puedes</div>
          <div>
            <Link to="/login">Iniciar sesi??n</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

SignUp.defaultProps = {
  saveUser: () => {},
};

SignUp.propTypes = {
  saveUser: PropTypes.func,
};

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
  saveUser: (user) => dispatch(saveUserAction(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
