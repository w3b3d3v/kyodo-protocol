import styles from "./Onboarding.module.scss"
import Image from 'next/image'
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Select from 'react-select'
import contractManager from '../../chains/ContractManager';
import { useAccount } from "../../contexts/AccountContext"
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import useTransactionHandler from '../../hooks/useTransactionHandler';
import Loader from '../utils/Loader';
import Toast from '../utils/Toast';

function saveToCache(data) {
  const dataString = JSON.stringify(data)
  localStorage.setItem("cachedData", dataString)
  console.log(localStorage.getItem("cachedData"))
}

function OnboardingProfessional() {
  const [nameProfessional, setName] = useState("")
  const [bioProfessional, setBio] = useState("")
  const [avatarProfessional, setAvatar] = useState("")
  const [websiteProfessional, setWebsite] = useState("")
  const [communityProfessional, setCommunity] = useState("")
  const [contract, setContract] = useState("")
  const [paymentsChain, setPaymentsChain] = useState("")
  const router = useRouter()
  const { account, selectedChain, selectedNetworkId, completeOnboarding } = useAccount()
  const { publicKey, wallet } = useWallet()
  const { connection } = useConnection()
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

  const SelectPaymentsChain = ({ handleChainChange }) => {
    const chainIds = contractManager.getSupportedChains();
    const options = chainIds.map(chainId => {
      const metadata = contractManager.chainMetadata(chainId);
      return {
        chainId: chainId,
        label: metadata.name, 
        icon: metadata.logo  
      };
    });
  
    const formatOptionLabel = ({ label, icon }) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={icon} alt={label} style={{ marginRight: 10, width: 20 }} />
        {label}
      </div>
    );
  
    return (
      <Select
        options={options}
        formatOptionLabel={formatOptionLabel}
        onChange={handleChainChange}
        isSearchable={false}
      />
    );
  };

  const handleSaveUserData = async (event) => {
    event.preventDefault();

    try {
      const details = {
        contract,
        paymentsChain
      }

      const onConfirmation = () => {
        setTimeout(() => {
          completeOnboarding();
          setIsLoading(false)
          router.push("/onboarding/complete")
        }, 3000)
      }

      await sendTransaction("savePreferedChain", details, "", onConfirmation)
    } catch (error) {
      console.log(error)
      console.error('Erro ao definir a chain preferida:', error);
    }
  };

  const handleChainChange = (e) => {
    setPaymentsChain(e)
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handleBioChange = (e) => {
    setBio(e.target.value)
  }

  const handleAvatarChange = (e) => {
    setAvatar(e.target.value)
  }

  const handleWebsiteChange = (e) => {
    setWebsite(e.target.value)
  }

  const handleCommunityChange = (e) => {
    setCommunity(e.target.value)
  }

  const handleButtonClick = () => {
    router.push("/onboarding/terms")
  }

  const { t } = useTranslation()

  return (
    <div className={styles["onboarding"]}>
      <Loader isLoading={isLoading} />
      <Toast
        transactionSuccess={transactionSuccess}
        transactionPending={transactionPending}
        transactionFail={transactionFail}
        errorMessage={errorMessage}
        transactionHash={transactionHash}
      />
      <div className={styles["onboarding-steps"]}>
        <h1>{t("welcome")}</h1>
        <ul>
          <li className={styles["done-step"]}>
            <Image src="/onboarding/checked-icon.svg" width={20} height={23} alt="Done" />
            <p>{t("connect-wallet")}</p>
          </li>
          <li className={styles["done-step"]}>
            <Image src="/onboarding/checked-icon.svg" width={20} height={23} alt="Done step" />
            <p>{t("profile-selection")}</p>
          </li>
          <li className={styles["current-step"]}>
            <Image src="/onboarding/current-icon.svg" width={20} height={23} alt="Current step" />
            <p>{t("initial-setup")}</p>
          </li>
          <li>
            <Image src="/onboarding/next-step-icon.svg" width={20} height={23} alt="Next step" />
            <p>{t("terms-conditions")}</p>
          </li>
        </ul>
      </div>

      <form className={styles["onboarding-form"]}>
        <h2 className={styles["professional-heading"]}>
          <span>{t("professional")}</span>
          <hr></hr>
        </h2>

        <h3>{t("personal-info")}</h3>

        <section className={"columns"}>
          <div className={"col-01"}>
            <label htmlFor="professional-name-input">
              {t("name")} <span>*</span>
            </label>
            <input
              type="text"
              onChange={handleNameChange}
              id="professional-name-input"
              tabIndex={1}
            />
          </div>
          <div className={"col-02"}>
            <label htmlFor="professional-community-input">
              {t("payment-network")} <span>*</span>
            </label>
            <div className={"custom-select"}>
              <SelectPaymentsChain handleChainChange={handleChainChange} />
            </div>
          </div>
        </section>
        <section className={styles["form-footer"]}>
          <Link href="/onboarding/profile-selection" className={styles["back-link"]}>
            {t("back")}
          </Link>
          <button onClick={(event) => handleSaveUserData(event)} className={styles["next-btn"]}>
            {t("next-step")}
          </button>
        </section>
      </form>
    </div>
  )
}

export default OnboardingProfessional;
