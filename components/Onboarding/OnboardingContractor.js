import styles from "./Onboarding.module.scss"
import Image from 'next/image'
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { useState } from 'react';
import { useRouter } from "next/router"

function saveToCache(data) {
  const dataString = JSON.stringify(data);
  localStorage.setItem('cachedData', dataString);
  console.log(localStorage.getItem('cachedData'));
}

function OnboardingContractor() {

  const [nameContractor, setName] = useState('');
  const [documentContractor, setDocument] = useState('');
  const [logoContractor, setLogo] = useState('');
  const [websiteContractor, setWebsite] = useState('');
  const [aboutContractor, setAbout] = useState('');

  const router = useRouter();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDocumentChange = (e) => {
    setDocument(e.target.value);
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.value);
  };

  const handleWebsiteChange = (e) => {
    setWebsite(e.target.value);
  };

  const handleAboutChange = (e) => {
    setAbout(e.target.value);
  };

  const handleButtonClick = () => {

    const formData = {
      nameContractor,
      documentContractor,
      logoContractor,
      websiteContractor,
      aboutContractor,
    };

    saveToCache(formData);
    
    router.push("/onboarding/terms");

  };

  const { t } = useTranslation()

  return (
    <div className={styles["onboarding"]}>
      <div className={styles["onboarding-steps"]}>
        <h1>{t("welcome")}</h1>
        <ul>
          <li className={styles["done-step"]}>
            <Image src="/onboarding/checked-icon.svg" width={20} height={23} alt="Done" />
            <p>{t("connect-wallet")}</p>
          </li>
          <li className={styles["done-step"]}>
            <Image src="/onboarding/checked-icon.svg" width={20} height={23} alt="Done" />
            <p>{t("profile-selection")}</p>
          </li>
          <li className={styles["current-step"]}>
            <Image src="/onboarding/current-icon.svg" width={20} height={23} alt="Current" />
            <p>{t("initial-setup")}</p>
          </li>
          <li>
            <Image src="/onboarding/next-step-icon.svg" width={20} height={23} alt="Next" />
            <p>{t("terms-conditions")}</p>
          </li>
        </ul>
      </div>

      <form className={styles["onboarding-form"]}>
        <h2 className={styles["contractor-heading"]}>
          <span>{t("contractor")}</span>
          <hr></hr>
        </h2>

        <h3>{t("basic-info")}</h3>

        <section className={"columns"}>
          <div className={"col-01"}>
            <label htmlFor="contractor-name-input">
              {t("company-name")} <span>*</span>
            </label>
            <input
              type="text"
              onChange={handleNameChange}
              id="contractor-name-input"
              tabIndex={1}
            />
            <label htmlFor="contractor-document-input">
              {t("company-document")} <span>*</span>
            </label>
            <input
              type="text"
              onChange={handleDocumentChange}
              id="contractor-document-input"
              tabIndex={2}
            />
          </div>
          <div className={"col-02"}>
            <label htmlFor="contractor-logo-input">{t("logo")}</label>
            <input
              type="text"
              onChange={handleLogoChange}
              id="contractor-logo-input"
              tabIndex={3}
            />
            <label htmlFor="contractor-website-input">{t("website")}</label>
            <input
              type="text"
              onChange={handleWebsiteChange}
              id="contractor-website-input"
              tabIndex={4}
            />
          </div>
        </section>

        <label htmlFor="contractor-about-input">
          {t("about")} <span>*</span>
        </label>
        <textarea
          type="text"
          onChange={handleAboutChange}
          id="contractor-about-input"
          tabIndex={5}
        ></textarea>

        <section className={styles["form-footer"]}>
          <Link href="/onboarding/profile-selection" className={styles["back-link"]}>
            {t("back")}
          </Link>
          <Link href="#" onClick={handleButtonClick} className={styles["next-btn"]} tabIndex={6}>
            {t("next-step")}
          </Link>
        </section>
      </form>
    </div>
  )
}

export default OnboardingContractor;
