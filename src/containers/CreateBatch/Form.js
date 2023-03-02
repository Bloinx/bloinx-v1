/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Select } from "antd";
import PageHeader from "../../components/PageHeader";
import InputSlider from "../../components/InputSlider";
import InputOptionSelect from "../../components/InputOptionSelect";
import ButtonOnlyOneStep from "../../components/ButtonOnlyOneStep";

import styles from "./index.module.scss";
import { periodicityOptions, participantsOptions } from "./constants";
import { confirmForm } from "./validations";
import useToken from "../../hooks/useToken";
import { getTokenId } from "../../api/utils/getTokenData";

const Form = ({ form, setForm, chainId, tokenSelected, setTokenSelected }) => {
  const history = useHistory();
  const { tokens } = useToken(chainId);
  console.log("tokens", tokens);
  const handlerOnSubmit = (values) => {
    setForm({
      ...form,
      ...values,
    });
    history.push("/create-round/confirm");
  };

  const getOptions = () => {
    return tokens?.map((token) => {
      return { value: token, label: token };
    });
  };
  let sliderInfo = { Min: 5, Max: 30, Step: 1 };
  if (tokenSelected === "jMXN") {
    sliderInfo = { Min: 100, Max: 500, Step: 50 };
  }

  return (
    <>
      <PageHeader title={<FormattedMessage id="createRound.title" />} />
      <Formik
        initialValues={{
          participants: form.participants,
          amount: sliderInfo.Min,
          periodicity: form.periodicity,
          token: form.token,
        }}
        validate={confirmForm}
        onSubmit={handlerOnSubmit}
      >
        {(props) => {
          const {
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            isValid,
            isSubmitting,
          } = props;
          const handleTokenChange = (value) => {
            setTokenSelected(value);
            handleChange({ target: { name: "token", value } });
          };
          return (
            <form onSubmit={handleSubmit}>
              <InputOptionSelect
                label={
                  <FormattedMessage id="createRound.form.label.participants" />
                }
                name="participants"
                value={values.participants}
                onChange={handleChange}
                options={participantsOptions}
                error={errors.participants}
              />

              <InputSlider
                label={<FormattedMessage id="createRound.form.label.amount" />}
                name="amount"
                value={values.amount}
                onChange={handleChange}
                min={sliderInfo.Min}
                max={sliderInfo.Max}
                step={sliderInfo.Step}
                error={errors.amount}
              />

              <div className={styles.CreateRound}>
                <div>
                  <div className={styles.CreateRoundTitle}>
                    <FormattedMessage id="createRound.labels.payPerRound" />
                  </div>
                  <div className={styles.CreateRoundAmount}>
                    {`${values.amount}`}
                    <Select
                      name="token"
                      value={values.token}
                      defaultValue={tokenSelected}
                      style={{ width: 120, marginLeft: 10 }}
                      onChange={handleTokenChange}
                    >
                      {getOptions().map((token) => (
                        <Select.Option key={token.value} value={token.value}>
                          {token.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div>
                  <div className={styles.CreateRoundTitle}>
                    <FormattedMessage id="createRound.labels.rewards" />
                  </div>
                  <div className={styles.CreateRoundAmount}>
                    {`${
                      values.amount * (values.participants - 1)
                    } ${tokenSelected}`}
                  </div>
                </div>
              </div>

              <InputOptionSelect
                label={
                  <FormattedMessage id="createRound.form.label.periodicity" />
                }
                name="periodicity"
                value={values.periodicity}
                onChange={handleChange}
                options={periodicityOptions}
              />

              <ButtonOnlyOneStep disabled={!isValid} type="submit" />
            </form>
          );
        }}
      </Formik>
    </>
  );
};

Form.propTypes = {
  form: PropTypes.instanceOf(Object).isRequired,
  setForm: PropTypes.func.isRequired,
  //  chainId: PropTypes.number,
};

export default Form;
