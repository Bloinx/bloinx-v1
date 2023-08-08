/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Modal } from "antd";

import PageHeader from "../../components/PageHeader";
import ButtonOnlyOneStep from "../../components/ButtonOnlyOneStep";
import Loader from "../../components/Loader";

import APISetCreateRound from "../../api/setCreateRoundSupabase";

import styles from "./Receipt.module.scss";
import {
  INITIAL_FORM_VALUES,
  periodicityOptions,
  paymentTime,
} from "./constants";
import { MainContext } from "../../providers/provider";
import { getTokenAddress } from "../../api/utils/getTokenData";

const Receipt = ({ form, setForm, tokenSelected }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { currentAddress, wallet, currentProvider } = useContext(MainContext);
  const handlerOnSubmit = (values) =>
    setForm({
      ...form,
      ...values,
      isComplete: true,
    });

  useEffect(() => {
    let cancel = false;
    if (form.isComplete && !currentAddress) {
      Modal.warning({
        title: "Wallet no encontrada",
        content: "Por favor conecta tu wallet antes de continuar.",
      });
      setForm({
        ...form,
        isComplete: false,
      });
    }
    if (form.isComplete && currentAddress && !cancel) {
      setLoading(true);
      APISetCreateRound({
        warranty: form.amount,
        saving: form.amount,
        groupSize: form.participants,
        payTime: paymentTime[form.periodicity],
        tokenSelected,
        isPublic: false,
        currentAddress,
        wallet,
        currentProvider,
      })
        .then(() => {
          setLoading(false);
          setForm(INITIAL_FORM_VALUES);
          history.push("/create-round/receipt/success");
        })
        .catch((err) => {
          setForm({
            ...form,
            isComplete: false,
          });
          setLoading(false);
          history.push("/create-round/receipt/error");
        });
    }
    return () => {
      cancel = true;
    };
  }, [form.isComplete, currentAddress, wallet, form, setForm, history]);

  return (
    <>
      <PageHeader title={<FormattedMessage id="createRound.title" />} />
      {loading && <Loader />}
      {!loading && (
        <>
          <div className={styles.ReceiptCard}>
            <div className={styles.ReceiptCardItem}>
              <div>
                <FormattedMessage id="createRound.form.label.participants" />
              </div>
              <div>{form.participants}</div>
            </div>
            <div className={styles.ReceiptCardItem}>
              <div>
                <FormattedMessage id="createRound.labels.amount" />
              </div>
              <div>{`${form.amount} ${tokenSelected}`}</div>
            </div>
            <div className={styles.ReceiptCardItem}>
              <div>
                <FormattedMessage id="createRound.labels.receiptAmount" />
              </div>
              <div>{`${
                form.amount * (form.participants - 1)
              } ${tokenSelected}`}</div>
            </div>
            <div className={styles.ReceiptCardItem}>
              <div>
                <FormattedMessage id="createRound.labels.roundTime" />
              </div>
              <div>
                {
                  periodicityOptions.find(
                    (option) => option.value === form.periodicity
                  ).label
                }
              </div>
            </div>
          </div>

          <ButtonOnlyOneStep
            loading={loading}
            label={<FormattedMessage id="createRound.actions.payGuarantee" />}
            // disabled={!values.termsAndConditions || !isValid}
            type="submit"
            onClick={handlerOnSubmit}
          />
        </>
      )}
    </>
  );
};

Receipt.propTypes = {
  form: PropTypes.instanceOf(Object).isRequired,
  setForm: PropTypes.func.isRequired,
};

export default Receipt;
