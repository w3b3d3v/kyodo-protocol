import styles from "./Onboarding.module.scss"
import Image from 'next/image'
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { useState } from 'react';

function saveToCache(data) {
  const dataString = JSON.stringify(data);
  localStorage.setItem('cachedData', dataString);
  console.log(localStorage.getItem('cachedData'));
}

function OnboardingCommunity() {

  const [nameCommunity, setName] = useState('');
  const [logoCommunity, setLogo] = useState('');
  const [descriptionCommunity, setDescription] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleButtonClick = () => {

    const formData = {
      nameCommunity,
      logoCommunity,
      descriptionCommunity
    };

    saveToCache(formData);
  };

  const { t } = useTranslation()

  return (
    <div className={styles["onboarding"]}>
      <div className={styles["onboarding-steps"]}>
        <h1>{t("welcome")}</h1>
        <ul>
          <li className={styles["done-step"]}>
            <Image src="/onboarding/checked-icon.svg" width={20} height={23} alt="Done icon" />
            <p>{t("connect-wallet")}</p>
          </li>
          <li className={styles["done-step"]}>
            <Image src="/onboarding/checked-icon.svg" width={20} height={23} alt="Done step icon" />
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
        <h2 className={styles["community-heading"]}>
          <span>{t("community")}</span>
          <hr></hr>
        </h2>

        <h3>{t("basic-info")}</h3>

        <section className={"columns"}>
          <div className={"col-01"}>
            <label htmlFor="community-name-input">{t("name")} <span>*</span></label>
            <input
              type="text"
              onChange={handleNameChange}
              id="community-name-input"
              tabIndex={1}
            />
          </div>
          <div className={"col-02"}>
            <label htmlFor="community-logo-input">{t("logo")}</label>
            <input type="text"
              onChange={handleLogoChange}
              id="community-logo-input"
              tabIndex={2}
            />
          </div>
        </section>

        <label htmlFor="community-description-input">{t("description")} <span>*</span></label>
        <textarea
          type="text"
          onChange={handleDescriptionChange}
          id="community-description-input"
          tabIndex={3}
        ></textarea>

        <h3>
          Token
          <i data-tooltip={t("token-tooltip")} className="tooltip-top">
            <Image src="/info-icon.svg" width={16} height={16} alt="Info icon" />
          </i>
        </h3>

        <section className={"columns"}>
          <div className={"col-01"}>
            <label htmlFor="smart-contract-input">Smart contract</label>
            <input type="text" id="smart-contract-input" tabIndex={4} />
          </div>
          <div className={"col-02"}>
            <label htmlFor="community-fee-input">{t("community-fee")}</label>
            <div className={styles["fee-field"]}>
              <span className={styles["fee-label"]}>%</span>
              <input type="text" id="community-fee-input" tabIndex={5} />
            </div>
          </div>
        </section>

        <section className={styles["form-footer"]}>
          <Link href="/onboarding/profile-selection" className={styles["back-link"]}>
            {t("back")}
          </Link>
          <button onClick={handleButtonClick} className={styles["next-btn"]} tabIndex={6}>
            {t("next-step")}
          </button>
        </section>
      </form>
    </div>
  )
}

export default OnboardingCommunity;
