import { useContract } from "../ContractContext"
import { useState } from "react"
import styles from "./AddAgreement.module.scss"

import { BeatLoader } from "react-spinners"
import tokens from "../../public/allowedTokens.json"
import { ethers } from "ethers"
const BigNumber = ethers.BigNumber

function AddAgreementForm(props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [developer, setDeveloper] = useState("")
  const [skills, setSkills] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentToken, setPaymentToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transactionHash, setTransactionHash] = useState(null)
  const { contract, loading } = useContract()

  async function handleSubmit(event) {
    event.preventDefault()

    // Check if any required fields are empty
    if (
      title.trim() === "" ||
      description.trim() === "" ||
      developer.trim() === "" ||
      skills.trim() === "" ||
      !paymentAmount ||
      !paymentToken
    ) {
      alert("Please fill in all fields.")
      return
    }

    // Call the function to add an agreement
    await addAgreement()
  }

  async function addAgreement() {
    setIsLoading(true)

    if (window.ethereum) {
      const paymentAmountInWei = BigNumber.from(paymentAmount)
        .mul(BigNumber.from(10).pow(paymentToken.decimals))
        .toString()

      try {
        const tx = await contract
          .createAgreement(
            title,
            description,
            developer,
            skills.split(","),
            paymentAmountInWei,
            paymentToken.address
          )

        console.log(`Agreement "${title}" created. Transaction hash: ${tx.transactionHash}`)
        setTransactionHash(tx.transactionHash)
      } catch (error) {
        console.error("Error creating agreement:", error)
      }

      setIsLoading(false)

      // Clear the form inputs after adding an agreement
      setTitle("")
      setDescription("")
      setDeveloper("")
      setSkills("")
      setPaymentAmount("")
      setPaymentToken("")
    }
  }

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="sweet-loading">
          <BeatLoader loading={isLoading} size={50} />
        </div>
      </div>
    )
  }

  if (transactionHash) {
    return (
      <div className={styles["transaction-info"]}>
        Agreement created!
        <br />
        <br />
        <a
          href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          See Transaction
        </a>
        <br />
        <br />
        {/* <Link to="/agreementslist">View Agreements List</Link> */}
      </div>
    )
  }

  return (
    <div className={styles["add-agreement-form-container"]}>
      <form className={styles["add-agreement-form"]} onSubmit={handleSubmit}>

        <h1>Add agreement</h1>

        <section className={"columns"}>

          <div className={"col-01"}>

            <label htmlFor="title-input">Title:</label>
            <input
              type="text"
              id="title-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <label htmlFor="developer-input">Professional wallet:</label>
            <input
              type="text"
              id="developer-input"
              value={developer}
              onChange={(event) => setDeveloper(event.target.value)}
            />

            <label htmlFor="payment-token-input">Payment Token:</label>
            <select
              id="payment-token-input"
              value={paymentToken ? paymentToken.address : ""}
              onChange={(event) => {
                const selectedTokenAddress = event.target.value
                const selectedToken = tokens.find((token) => token.address === selectedTokenAddress)
                setPaymentToken(selectedToken)
              }}
              className={styles["select-input"]}
            >
              <option value="">Selecione um token</option>
              {tokens.map((token) => (
                <option key={token.address} value={token.address} className={styles["token-option"]}>
                  {token.name}
                </option>
              ))}
            </select>

            <label htmlFor="payment-amount-input">Payment Amount:</label>
            <input
              type="number"
              id="payment-amount-input"
              value={paymentAmount}
              onChange={(event) => setPaymentAmount(parseInt(event.target.value))}
            />

          </div>

          <div className={"col-02"}>

            <label htmlFor="description-input">Description:</label>
            <input
              type="text"
              id="description-input"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />

            <label htmlFor="skills-input">Skills:</label>
            <input
              type="text"
              id="skills-input"
              value={skills}
              onChange={(event) => setSkills(event.target.value)}
            />

          </div>

        </section>

        <section className={styles["form-footer"]}>
          <button type="submit" className={styles["add-agreement-form-button"]}>
            <div>Add</div>
          </button>
        </section>

      </form>
    </div>
  )
}

export default AddAgreementForm;

