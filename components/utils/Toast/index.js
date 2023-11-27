// Toast.js
import React, { useEffect, useState } from "react" // <-- Import useEffect and useState
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import contractManager from '../../../chains/ContractManager';
import { useAccount } from "../../../contexts/AccountContext";

function Toast({
  transactionSuccess,
  transactionPending,
  transactionFail,
  errorMessage,
  transactionHash,
  warning,
  warningMessage
}) {
  const { t } = useTranslation()
  const { account, selectedChain, selectedNetworkId} = useAccount();
  const [visible, setVisible] = useState(true) // <-- Add a state to manage visibility

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false) // <-- Hide the toast after 3 seconds
      }, 3000)
      return () => clearTimeout(timer) // <-- Clear the timer when component unmounts or if visibility changes
    }
  }, [visible])

  useEffect(() => {
    if (transactionSuccess || transactionFail || transactionPending || warning ) {
      setVisible(true) // <-- Show the toast when transaction succeeds or fails
    }
  }, [transactionSuccess, transactionPending, transactionFail, warning])

  if (!visible) return null // <-- Don't render the component if it's not visible

  if (transactionSuccess) {
    const explorerLink = contractManager.blockExplorer(selectedChain, selectedNetworkId)
    return (
      <div className="flash-success transaction-info">
        <p>
          <Image src="/success-icon.svg" width={20} height={20} alt="Success icon" />
          {t("transaction-success")}
        </p>
        <Link
          href={explorerLink + "tx/" +transactionHash.hash}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("view-on")}
        </Link>
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

  if (warning) {
    let displayMessage = warningMessage
    return (
      <div className="flash-alert transaction-info">
        <p>
          <Image src="/pending-icon.svg" width={20} height={20} alt="Pending icon" />
          {displayMessage}
        </p>
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
