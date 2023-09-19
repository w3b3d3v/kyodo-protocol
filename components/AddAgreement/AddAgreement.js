import { useRouter } from 'next/router'
import { useAgreementContract } from "../../contexts/ContractContext"
import { useState } from "react"
import styles from "./AddAgreement.module.css"
import Image from 'next/image'
import { BeatLoader } from "react-spinners"
import { ethers } from "ethers"
const BigNumber = ethers.BigNumber

function AddAgreementForm(props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [developer, setDeveloper] = useState("")
  const [skills, setSkills] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transactionHash, setTransactionHash] = useState(null)
  const { contract, loading } = useAgreementContract()
  const router = useRouter()

  async function handleSubmit(event) {
    event.preventDefault()

    // Check if any required fields are empty
    if (
      title.trim() === "" ||
      description.trim() === "" ||
      developer.trim() === "" ||
      skills.trim() === "" ||
      !paymentAmount
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
        .mul(BigNumber.from(10).pow(18))
        .toString()

      try {
        const tx = await contract
          .createAgreement(
            title,
            description,
            developer,
            skills.split(","),
            paymentAmountInWei,
          )
        await tx.wait()
      } catch (error) {
        console.error("Error creating agreement:", error)
      } finally {
        setIsLoading(false)
        router.push('/agreements')
      }

      setIsLoading(false)

      // Clear the form inputs after adding an agreement
      setTitle("")
      setDescription("")
      setDeveloper("")
      setSkills("")
      setPaymentAmount("")
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
        <div className={styles["holder"]}>
          <p>
            <Image
              src="/success-icon.svg"
              width={20}
              height={20}
            />
            Agreement created!
          </p>
          <a
            href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            See Transaction
          </a>
        </div>
      </div>
    )
  }

  return (
    
    <div className={styles["add-agreement-form-container"]}>

      <h1>Add agreement</h1>

      <form className={styles["add-agreement-form"]} onSubmit={handleSubmit}>

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
            <textarea
              id="description-input"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            ></textarea>

            <label htmlFor="skills-input">Skills:</label>
            <textarea
              id="skills-input"
              value={skills}
              onChange={(event) => setSkills(event.target.value)}
            ></textarea>

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
