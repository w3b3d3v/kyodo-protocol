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
  const [paymentAmount, setPaymentAmount] = useState("")
  const [formErrors, setFormErrors] = useState({})
  const router = useRouter()
  const { account, selectedChain, selectedNetworkId } = useAccount()
  const { publicKey, wallet } = useWallet()
  const { connection } = useConnection()
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [skillsList, setSkillsList] = useState([]);
  const totalSkillsLevel = (skills) => skills.reduce((total, skill) => total + skill.level, 0);

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

        const agreementContract = await contractManager.chains[selectedNetworkId].agreementContract(
          details
        )
        setContract(agreementContract)
      } catch (error) {
        console.error("Error when getting the contract", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeContract()
  }, [selectedNetworkId, wallet, connection])

  const skillSchema = Yup.object().shape({
    skills: Yup.string()
      .required(t('validation.skill-required')),
    level: Yup.number()
      .required(t('validation.level-required'))
      .test(
        'is-valid-level',
        t('validation.is-valid-level'),
        value => value > 0 && value <= 100
      )
      .test(
        'total-level-check',
        t('validation.total-level-check'),
        value => {
          const newTotalLevel = totalSkillsLevel(skillsList) + value;
          return newTotalLevel <= 100;
        }
      ),
  });

  const handleRemoveSkill = (skillName) => {
    const filteredSkills = skillsList.filter(skill => skill.name !== skillName);
    setSkillsList(filteredSkills);
  };

  const handleAddSkill = async (event) => {
    event.preventDefault();
  
    try {
      await skillSchema.validate({ skills: skillName, level: skillLevel }, { abortEarly: false });
  
      setSkillsList([...skillsList, { name: skillName, level: parseInt(skillLevel, 10) }]);
      setSkillName('');
      setSkillLevel('');
      setFormErrors({});
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
  };

  const AgreementSchema = Yup.object().shape({
    title: Yup.string().required(t('validation.required', { field: 'Title' })),
    description: Yup.string().required(t('validation.required', { field: 'Description' })),
    professional: Yup.string()
      .required(t('validation.required', { field: 'Professional' }))
      .test(
        "valid-chain-address",
        t('validation.valid-chain-address', { chain: selectedChain }),
        function (value) {
          const validator = contractManager.getAddressValidator(selectedChain)
          return validator && validator.test(value)
        }
      )
      .test(
        "is-not-company",
        t('validation.is-not-company'),
        function (value) {
          return value.toLowerCase() !== account.toLowerCase()
        }
      ),
    paymentAmount: Yup.number()
      .transform((value, originalValue) => {
        return originalValue === "" ? undefined : value
      })
      .required(t('validation.required', { field: 'Payment amount' }))
      .positive(t('validation.positive', { field: 'Payment amount' })),
    skillsList: Yup.array()
      .test(
        'total-level-100',
        t('validation.total-level-100'),
        (skillsList) => totalSkillsLevel(skillsList) === 100
      ),
  });

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await AgreementSchema.validate(
        {
          title,
          description,
          professional,
          skillsList,
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
      skillsList,
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
      setPaymentAmount("")
      setSkillsList("")
      setSkillName("")
      setSkillLevel("")
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
              <select tabIndex={4} id="community-input">
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
              tabIndex={5}
            ></textarea>

            <label htmlFor="skills-input" className={styles["skill-lv"]}>
              {t("skills")}
              <span>Lv.</span>
            </label>
            {formErrors.skillsList && <div className={"validation-msg"}>{formErrors.skillsList}</div>}
            {formErrors.skills && <div className={"validation-msg"}>{formErrors.skills}</div>}
            {formErrors.level && <div className="validation-msg">{formErrors.level}</div>}
            <div className={styles["skills-field"]}>
              <input
                type="text"
                id="skills-input"
                className={styles["skills-input"]}
                value={skillName}
                onChange={(event) => setSkillName(event.target.value)}
                tabIndex={6}
              />
              <i data-tooltip={t("skills-tooltip")} className="tooltip-top">
                <input
                  type="text"
                  id="skill-value"
                  className={styles["skill-value"]}
                  placeholder="%"
                  tabIndex={7}
                  value={skillLevel}
                  onChange={(event) => setSkillLevel(event.target.value)}
                />
              </i>
            </div>
            <button onClick={handleAddSkill} className={styles["add-skill-btn"]} tabIndex={8}>
              <Image src="/add.svg" width={16} height={16} alt="add" />
              <span>{t("add")}</span>
            </button>

            <ul className={styles["skills-list"]}>
              {skillsList.map((skill, index) => (
                <li key={index}>
                <div className={styles["skill-item"]}>
                  <span>{skill.name}</span>
                  <Image src="/close.svg" width={16} height={16} alt="close" onClick={() => handleRemoveSkill(skill.name)} />
                </div>
                <em>{skill.level}%</em>
                </li>
              ))}
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
