import { useRouter } from 'next/router'
import { useAccount } from "../../contexts/AccountContext"
import { useState, useEffect } from "react"
import styles from "./AddAgreement.module.scss"
import Image from 'next/image'
import Link from "next/link"
import Loader from '../utils/Loader';
import Toast from '../utils/Toast';
import useTransactionHandler from '../../hooks/useTransactionHandler';
import { useTranslation } from "react-i18next"
import * as Yup from "yup"
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import contractManager from '../../chains/ContractManager';
import { ethers } from "ethers"

function AddAgreementForm(props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [contract, setContract] = useState("")
  const [professional, setProfessional] = useState("")
  const [skills, setSkills] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [formErrors, setFormErrors] = useState({})
  const router = useRouter()
  const { account, selectedChain } = useAccount()
  const { publicKey, wallet } = useWallet()
  const { connection } = useConnection()
  // const { contract } = useAgreementContract();
  const { t } = useTranslation()
  const {
    isLoading,
    setIsLoading,
    transactionSuccess,
    transactionPending,
    transactionFail,
    errorMessage,
    sendTransaction,
    transactionHash,
  } = useTransactionHandler()

  useEffect(() => {
    async function initializeContract() {
      try {
        setIsLoading(true)
        const details = {
          wallet,
          connection,
        }

        const agreementContract = await contractManager.chains[selectedChain].agreementContract(
          details
        )
        setContract(agreementContract)
      } catch (error) {
        console.error("Houve um problema ao inicializar o contrato", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeContract()
  }, [selectedChain, wallet, connection])

  const AgreementSchema = Yup.object().shape({
    title: Yup.string().required(),
    description: Yup.string().required(),
    professional: Yup.string()
      .required()
      .test(
        "valid-chain-address",
        `Professional must be a valid ${selectedChain} address`,
        function (value) {
          const validator = contractManager.getAddressValidator(selectedChain)
          return validator && validator.test(value)
        }
      )
      .test(
        "is-not-company",
        "Professional address cannot be the same as the agreement owner or company",
        function (value) {
          return value.toLowerCase() !== account.toLowerCase()
        }
      ),
    skills: Yup.string()
      .required()
      .test("is-comma-separated", "Skills should be comma-separated", (value) => {
        if (!value) return false
        const skillsArray = value.split(",")
        return skillsArray.every((skill) => !!skill.trim())
      }),
    paymentAmount: Yup.number()
      .transform((value, originalValue) => {
        return originalValue === "" ? undefined : value
      })
      .required()
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
      console.log(errors)
      if (errors instanceof Yup.ValidationError) {
        const errorMessages = {}
        errors.inner.forEach((error) => {
          errorMessages[error.path] = error.message
        })
        setFormErrors(errorMessages)
      }
    }
  }

  const addAgreement = async () => {
    const details = {
      title,
      description,
      professional,
      skills: skills.split(","),
      paymentAmount,
      account,
      contract,
      publicKey,
      wallet
    };

    const onConfirmation = () => {
      fetch("/api/notify?type=agreement&account=" + ethers.utils.getAddress(account))
      setTitle("")
      setDescription("")
      setProfessional("")
      setSkills("")
      setPaymentAmount("")
      setTimeout(() => {
        setIsLoading(false)
        router.push("/agreements")
      }, 3000)
    }

    await sendTransaction("addAgreement", details, "AgreementCreated", onConfirmation)
  }

  return (
    <div className={styles["add-agreement-form-container"]}>
      <Loader isLoading={isLoading} />
      <Toast
        transactionSuccess={transactionSuccess}
        transactionPending={transactionPending}
        transactionFail={transactionFail}
        errorMessage={errorMessage}
        transactionHash={transactionHash}
      />

      <h1>{t("add-agreement-heading")}</h1>
      <form className={styles["add-agreement-form"]} onSubmit={handleSubmit}>
        <section className={"columns"}>
          <div className={"col-01"}>
            <label htmlFor="title-input">{t("title")}</label>
            {formErrors.title && <div className={"validation-msg"}>{formErrors.title}</div>}
            <div className={styles["generic-field"]}>
              <span>
                <Image src="/agreement-title-icon.svg" width={17} height={17} alt="Agreement" />
              </span>
              <input
                type="text"
                id="title-input"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                tabIndex={1}
              />
            </div>

            <label htmlFor="professional-input">{t("professional-wallet")}</label>
            {formErrors.professional && (
              <div className={"validation-msg"}>{formErrors.professional}</div>
            )}
            <div className={styles["generic-field"]}>
              <span>
                <Image src="/agreement-wallet-icon.svg" width={16} height={16} alt="Wallet" />
              </span>
              <input
                type="text"
                id="professional-input"
                value={professional}
                onChange={(event) => setProfessional(event.target.value)}
                tabIndex={2}
              />
            </div>

            <label htmlFor="payment-amount-input">{t("payment-amount")}</label>
            {formErrors.paymentAmount && (
              <div className={"validation-msg"}>{formErrors.paymentAmount}</div>
            )}
            <div className={styles["amount-field"]}>
              <span>USD</span>
              <input
                type="number"
                id="payment-amount-input"
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(parseFloat(event.target.value))}
                tabIndex={3}
              />
            </div>
            <label htmlFor="community-input">{t("community")}</label>
            <div className={"custom-select"}>
              <select tabIndex={5} id="community-input">
                <option>{t("select-option")}</option>
                <option>Phala Network</option>
                <option>WEB3DEV</option>
                <option>Web3Garden</option>
                <option>DecentralizeTech</option>
                <option>CryptoCollective</option>
                <option>NFTCreatorsDAO</option>
                <option>DeFiAlliance</option>
                <option>MetaMakersDAO</option>
                <option>BlockchainBuilders</option>
                <option>EtherGovernance</option>
                <option>DecentralizedDreamers</option>
                <option>TokenTorch</option>
                <option>SmartWebSociety</option>
                <option>DeFiDragons</option>
              </select>
            </div>
          </div>

          <div className={"col-02"}>
            <label htmlFor="description-input">{t("description")}</label>
            {formErrors.description && (
              <div className={"validation-msg"}>{formErrors.description}</div>
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
            {formErrors.skills && <div className={"validation-msg"}>{formErrors.skills}</div>}
            <div className={styles["skills-field"]}>
              <i data-tooltip={t("skills-tooltip")} className="tooltip-top">
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
            <Link href="#" className={styles["add-skill-btn"]} tabIndex={7}>
              <Image src="/add.svg" width={16} height={16} alt="add" />
              <span>{t("add")}</span>
            </Link>

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
