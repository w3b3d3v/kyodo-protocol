import { useRouter } from 'next/router'
import { useAgreementContract } from "../../contexts/ContractContext"
import { useAccount } from "../../contexts/AccountContext"
import { useState } from "react"
import styles from "./AddAgreement.module.scss"
import Image from 'next/image'
import { BeatLoader } from "react-spinners"
import { ethers } from "ethers"
import { useTranslation } from "react-i18next"
import * as Yup from "yup"

function AddAgreementForm(props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [professional, setProfessional] = useState("")
  const [skills, setSkills] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transactionHash, setTransactionHash] = useState(null)
  const { contract, loading } = useAgreementContract()
  const [formErrors, setFormErrors] = useState({})
  const router = useRouter()
  const { account } = useAccount()
  const { t } = useTranslation()

  const AgreementSchema = Yup.object().shape({
    title: Yup.string().required(),
    description: Yup.string().required("Description is required"),
    professional: Yup.string()
      .required("Professional is required")
      .matches(/^0x[a-fA-F0-9]{40}$/, "Professional must be a valid Ethereum address")
      .test(
        "is-not-company",
        "Professional address cannot be the same as the agreement owner or company",
        function (value) {
          return value.toLowerCase() !== account.toLowerCase()
        }
      ),
    skills: Yup.string()
      .required("Skills are required")
      .test("is-comma-separated", "Skills should be comma-separated", (value) => {
        if (!value) return false
        const skillsArray = value.split(",")
        return skillsArray.every((skill) => !!skill.trim())
      }),
    paymentAmount: Yup.number()
      .transform((value, originalValue) => {
        return originalValue === "" ? undefined : value
      })
      .required("Payment amount is required")
      .positive("Payment amount should be positive"),
  })

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await AgreementSchema.validate(
        {
          title,
          description,
          professional,
          skills,
          paymentAmount,
        },
        {
          abortEarly: false,
        }
      )
      setFormErrors({})
      await addAgreement()
    } catch (errors) {
      if (errors instanceof Yup.ValidationError) {
        const errorMessages = {}
        errors.inner.forEach((error) => {
          errorMessages[error.path] = error.message
        })
        setFormErrors(errorMessages)
      }
    }
  }

  async function addAgreement() {
    setIsLoading(true)

    if (window.ethereum) {
      const paymentAmountInWei = ethers.utils.parseUnits(paymentAmount.toString(), 18)

      try {
        const tx = await contract.createAgreement(
          title,
          description,
          professional,
          skills.split(","),
          paymentAmountInWei
        )
        await tx.wait()
      } catch (error) {
        console.error("Error creating agreement:", error)
      } finally {
        setIsLoading(false)
        router.push("/agreements")
      }

      setIsLoading(false)
      setTitle("")
      setDescription("")
      setProfessional("")
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
      <div className="transaction-info tracking-in-expand">
        <div className={styles["holder"]}>
          <p>
            <Image src="/success-icon.svg" width={20} height={20} />
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
            <label htmlFor="title-input">{t("title")}</label>
            {formErrors.title && (
              <div className={"validation-msg"}>
                {formErrors.title}
              </div>
            )}
            <input
              type="text"
              id="title-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <label htmlFor="professional-input">Professional wallet</label>
            {formErrors.professional && (
              <div className={"validation-msg"}>
                {formErrors.professional}
              </div>
            )}
            <input
              type="text"
              id="professional-input"
              value={professional}
              onChange={(event) => setProfessional(event.target.value)}
            />

            <label htmlFor="payment-amount-input">Payment amount</label>
            {formErrors.paymentAmount && (
              <div className={"validation-msg"}>
                {formErrors.paymentAmount}
              </div>
            )}

            <div className={styles["amount-field"]}>
              <span className={styles["usd-label"]}>USD</span>
              <input
                type="number"
                id="payment-amount-input"
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(parseFloat(event.target.value))}
              />
            </div>
          </div>

          <div className={"col-02"}>
            <label htmlFor="description-input">Description</label>
            {formErrors.description && (
              <div className={"validation-msg"}>
                {formErrors.description}
              </div>
            )}
            <textarea
              id="description-input"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            ></textarea>

            <label htmlFor="skills-input" className={styles["skill-lv"]}>
              Skills
              <span>Lv.</span>
            </label>
            {formErrors.skills && (
              <div className={"validation-msg"}>
                {formErrors.skills}
              </div>
            )}
            <div className={styles["skills-field"]}>
              <i data-tooltip="The sum must equal 100%" className="tooltip-top">
                <input
                  type="text"
                  id="skill-value"
                  className={styles["skill-value"]}
                  placeholder="%"
                />
              </i>
              <input
                type="text"
                id="skills-input"
                className={styles["skills-input"]}
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
              />
            </div>
            <a href="#" className={styles["add-skill-btn"]}>
            <Image src="/add.svg" width={16} height={16} />
              <span>add</span>
            </a>

            <ul className={styles["skills-list"]}>
              <li>
                <div className={styles["skill-item"]}>
                  <span>Dev Ops</span>
                  <Image src="/close.svg" width={16} height={16} />
                </div>
                <em>30%</em>
              </li>
              <li>
                <div className={styles["skill-item"]}>
                  <span>Quality Assurance</span>
                  <Image src="/close.svg" width={16} height={16} />
                </div>
                <em>20%</em>
              </li>
            </ul>
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
