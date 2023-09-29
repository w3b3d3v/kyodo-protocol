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
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [transactionFail, setTransactionFail] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { contract } = useAgreementContract()
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
    setIsLoading(true);
    setTransactionFail(false);
    setTransactionPending(false);
    setTransactionSuccess(false);

    if (window.ethereum) {
      const paymentAmountInWei = ethers.utils.parseUnits(paymentAmount.toString(), 18);

      try {
        const txPromise = contract.createAgreement(
          title,
          description,
          professional,
          skills.split(","),
          paymentAmountInWei
        );
        
        const txResponse = await Promise.race([
          txPromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Failed to send transaction')), 5000))
        ]);

        const agreementCreated = new Promise((resolve, reject) => {
          const timeout = setTimeout(async () => {
            const tx = await provider.getTransaction(txResponse.hash);
            if (tx && tx.blockNumber) {
              resolve({ agreementId: tx.transactionIndex, event: tx });
            } else {
              reject(new Error('Transaction is still pending'));
            }
          }, 20000);

          contract.on("AgreementCreated", (agreementId, event) => {
            clearTimeout(timeout);
            resolve({ agreementId, event });
          });
        });

        const { agreementId, event } = await agreementCreated;
        console.log("Agreement Created:", agreementId, event);
        setTransactionSuccess(true);

        setTimeout(() => {
          setIsLoading(false);
          router.push("/agreements");
        }, 1500);

        setTitle("");
        setDescription("");
        setProfessional("");
        setSkills("");
        setPaymentAmount("");

      } catch (error) {
        setErrorMessage(error.message);
        console.error("Error:", errorMessage);
        if (error.message === 'Transaction is still pending') {
          setTransactionPending(true);
          setTimeout(() => {
            setIsLoading(false);
            router.push("/agreements");
          }, 3000);
        } else {
          setTransactionFail(true);
          setTimeout(() => {
            setIsLoading(false);
            setTransactionFail(false);
          }, 3000);
        }
      }
    }
  }

  return (
    <div className={styles["add-agreement-form-container"]}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="sweet-loading">
            <BeatLoader loading={isLoading} size={50} />
          </div>
        </div>
      )}

      {transactionSuccess && (
        <div className="flash-success transaction-info">
          <p>
          <Image src="/success-icon.svg" width={20} height={20} alt="Success icon" />
            Agreement created!
          </p>
        </div>
      )}

      {transactionPending && (
        <div className="flash-pending transaction-info">
          <p>
          <Image src="/pending-icon.svg" width={20} height={20} alt="Pending icon" />
            Transaction is still pending, please wait.
          </p>
        </div>
      )}

      {transactionFail && (
        <div className="flash-error transaction-info">
          <p>
          <Image src="/error-icon.svg" width={20} height={20} alt="Error icon" />
            {errorMessage}
          </p>
        </div>
      )}

      <h1>{t("add-agreement-heading")}</h1>
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
              tabIndex={1}
            />

            <label htmlFor="professional-input">{t("professional-wallet")}</label>
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
              tabIndex={2}
            />

            <label htmlFor="payment-amount-input">{t("payment-amount")}</label>
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
                tabIndex={3}
              />
            </div>
          </div>

          <div className={"col-02"}>
            <label htmlFor="description-input">{t("description")}</label>
            {formErrors.description && (
              <div className={"validation-msg"}>
                {formErrors.description}
              </div>
            )}
            <textarea
              id="description-input"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              tabIndex={4}
            ></textarea>

            <label htmlFor="skills-input" className={styles["skill-lv"]}>
              {t("skills")}
              <span>Lv.</span>
            </label>
            {formErrors.skills && (
              <div className={"validation-msg"}>
                {formErrors.skills}
              </div>
            )}
            <div className={styles["skills-field"]}>
              <i data-tooltip={t('skills-tooltip')} className="tooltip-top">
                <input
                  type="text"
                  id="skill-value"
                  className={styles["skill-value"]}
                  placeholder="%"
                  tabIndex={6}
                />
              </i>
              <input
                type="text"
                id="skills-input"
                className={styles["skills-input"]}
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                tabIndex={5}
              />
            </div>
            <a href="#" className={styles["add-skill-btn"]} tabIndex={7}>
            <Image src="/add.svg" width={16} height={16} alt="add" />
              <span>{t("add")}</span>
            </a>

            <ul className={styles["skills-list"]}>
              <li>
                <div className={styles["skill-item"]}>
                  <span>Dev Ops</span>
                  <Image src="/close.svg" width={16} height={16} alt="close" />
                </div>
                <em>30%</em>
              </li>
              <li>
                <div className={styles["skill-item"]}>
                  <span>Quality Assurance</span>
                  <Image src="/close.svg" width={16} height={16} alt="close" />
                </div>
                <em>20%</em>
              </li>
            </ul>
          </div>
        </section>

        <section className={styles["form-footer"]}>
          <button type="submit" className={styles["add-agreement-form-button"]} tabIndex={8}>
            <div>{t("add-btn")}</div>
          </button>
        </section>
      </form>
    </div>
  )
}

export default AddAgreementForm;
