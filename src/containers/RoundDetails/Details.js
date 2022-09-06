/* eslint-disable react/self-closing-comp */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MailOutlined } from "@ant-design/icons";

import PageHeader from "../../components/PageHeader";
import PageSubHeader from "../../components/PageSubHeader";
import InputLabel from "../../components/InputLabel";

import { formatAddress } from "../../utils/format";
import styles from "./Details.module.scss";
import getFuturePayments from "../../api/getFuturePaymentsSupabase";

function Details({ roundData, roundId, currentAddress, currentProvider }) {
  const [futurePayment, setFuturePayment] = useState("");
  const totalRemain = async () => {
    const response = await getFuturePayments(
      roundId,
      currentAddress,
      currentProvider
    );
    if (response) {
      setFuturePayment(response);
    }
  };
  totalRemain();

  return (
    <>
      <PageHeader title={roundData?.positionAdminData?.alias} />
      <InputLabel
        label="ContratoID"
        value={formatAddress(roundData.contract)}
      />
      <InputLabel label="Estatus de la ronda" value={roundData.stage} />
      <InputLabel label="Total restante" value={futurePayment} />
      <InputLabel
        label="Participantes"
        value={
          <table className={styles.DetailParticipantsItem}>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th>Cobro</th>
            </tr>
            {roundData.participantsData &&
              roundData.participantsData.map((participant) => (
                <tr key={participant.address}>
                  <th>{participant.position}</th>
                  <th>{formatAddress(participant.address)}</th>
                  <th>{participant.admin && "Admin"}</th>
                  <th>{participant.dateToWithdraw}</th>
                </tr>
              ))}
          </table>
        }
      />
      {roundData.stage === "ON_REGISTER_STAGE" &&
        roundData?.positionAdminData?.wallet === currentAddress &&
        currentAddress !== null && (
          <>
            <PageSubHeader title="Invitaciones" />
            <Link
              to={`/invitations?roundId=${roundId}`}
              className={styles.RoundCardTitle}
            >
              <MailOutlined style={{ color: "white", fontSize: "20px" }} />
            </Link>
            <InputLabel
              label="Invitaciones enviadas"
              value={
                <div className={styles.DetailParticipantsItem}>
                  {roundData.invitations &&
                    roundData.invitations?.map((email) => {
                      if (email.isRegister === false) {
                        return (
                          <ul key={email.id}>
                            <li>{email.userEmail}</li>
                          </ul>
                        );
                      }
                      return "";
                    })}
                </div>
              }
            />
          </>
        )}
    </>
  );
}

export default Details;
