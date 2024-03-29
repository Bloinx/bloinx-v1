/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";

import InputCheck from "../../components/InputCheck";
import ButtonOnlyOneStep from "../../components/ButtonOnlyOneStep";
import MethodGetRegisterStable from "../../api/setRegisterUserStable";

import { receiptValidation } from "./validations";
import styles from "./Terms.module.scss";

function Terms({ form, baseUrl, walletAddress, roundData, wallet, chainId }) {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const handlerOnSubmit = () => {
    setLoading(true);
    MethodGetRegisterStable({
      walletAddress,
      roundId: roundData.roundId,
      wallet,
      chainId,
    })
      .then(() => {
        history.push(`${baseUrl}/join?roundId=${roundData.roundId}`);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Formik
      initialValues={{
        termsAndConditions: form.termsAndConditions,
      }}
      validate={receiptValidation}
      onSubmit={handlerOnSubmit}
    >
      {(props) => {
        const { values, errors, handleChange, handleSubmit, isValid } = props;
        return (
          <form onSubmit={handleSubmit}>
            <div className={styles.ReceiptCard}>
              <div className={styles.ReceiptCardTerms}>
                <FormattedMessage id="infoLabels.guaranteeInfo" />
              </div>

              <div style={{ margin: "10px 0" }}>
                <InputCheck
                  label={<FormattedMessage id="createRound.labels.terms" />}
                  name="termsAndConditions"
                  onChange={handleChange}
                  error={errors?.name}
                  checked={values.termsAndConditions}
                />
              </div>
            </div>

            <ButtonOnlyOneStep
              loading={loading}
              label={<FormattedMessage id="createRound.actions.continue" />}
              disabled={!values.termsAndConditions || !isValid}
              type="submit"
            />
          </form>
        );
      }}
    </Formik>
  );
}

Terms.propTypes = {
  form: PropTypes.instanceOf(Object).isRequired,
};

export default React.memo(Terms);
