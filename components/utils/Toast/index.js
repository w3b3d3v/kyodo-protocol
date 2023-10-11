// Toast.js
import React from 'react';
import Image from 'next/image';
import Link from "next/link"
import { useTranslation } from "react-i18next"

function Toast({
  transactionSuccess,
  transactionPending,
  transactionFail,
  errorMessage,
  transactionHash,
}) {
  const { t } = useTranslation()
  if (transactionSuccess) {
    return (
      <div className="flash-success transaction-info">
        <p>
          <Image src="/success-icon.svg" width={20} height={20} alt="Success icon" />
          {t("transaction-success")}
        </p>
      </div>
    )
  }

  if (transactionPending) {
    return (
      <div className="flash-pending transaction-info">
        <p>
          <Image src="/pending-icon.svg" width={20} height={20} alt="Pending icon" />
          {t("agreement-pending")}
        </p>
        <Link
          href={`https://polygonscan.com/tx/${transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Check the status here
        </Link>
      </div>
    )
  }

  if (transactionFail) {
    let displayMessage = errorMessage
    return (
      <div className="flash-error transaction-info">
        <p
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          <Image src="/error-icon.svg" width={20} height={20} alt="Error icon" />
          {displayMessage}
        </p>
      </div>
    )
  }

  return null
}

export default Toast;
