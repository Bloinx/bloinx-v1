/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "antd";
import InputCheck from "../../components/InputCheck";
import ButtonOnlyOneStep from "../../components/ButtonOnlyOneStep";
import MethodGetRegisterStable from "../../api/setRegisterUserStable";

import { receiptValidation } from "./validations";
import styles from "./Terms.module.scss";
import { getGuaranteeBalance, getTokenName } from "./utils";

function Terms({
  form,
  baseUrl,
  walletAddress,
  roundData,
  wallet,
  chainId,
  funds,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    history.push("/dashboard");
  };

  const handlerOnSubmit = (data) => {
    setLoading(true);
    if (
      data.cashIn * 1.05 >
        parseFloat(getGuaranteeBalance(funds, data?.tokenId)?.balance) ||
      getGuaranteeBalance(funds, data?.tokenId) === undefined
    ) {
      showModal();
    } else {
      MethodGetRegisterStable({
        walletAddress,
        roundId: data.roundId,
        wallet,
        chainId,
      })
        .then(() => {
          history.push(`${baseUrl}/join?roundId=${data.roundId}`);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Formik
      initialValues={{
        termsAndConditions: form.termsAndConditions,
      }}
      validate={receiptValidation}
      onSubmit={() => handlerOnSubmit(roundData)}
    >
      {(props) => {
        const { values, errors, handleChange, handleSubmit, isValid } = props;
        return (
          <div>
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
            <Modal
              title="Billetera sin fondos"
              closeIcon={<></>}
              open={isModalOpen}
              onOk={handleOk}
              footer={[
                <Button type="primary" onClick={handleOk}>
                  Ok
                </Button>,
              ]}
            >
              <p>
                Necesitas al menos {roundData.cashIn * 1.05}{" "}
                {getTokenName(roundData?.tokenId)} para completar esta acción.
              </p>
            </Modal>
          </div>
        );
      }}
    </Formik>
  );
}

Terms.propTypes = {
  form: PropTypes.instanceOf(Object).isRequired,
};

export default Terms;
