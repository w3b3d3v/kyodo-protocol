import styles from "./Onboarding.module.scss"
import Image from 'next/image'
import { useTranslation } from "react-i18next"

function OnboardingCommunity() {

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
            <Image src="/onboarding/next-step-icon.svg" width={20} height={23} alt="Current step icon" />
            <p>{t("initial-setup")}</p>
          </li>
          <li>
            <Image src="/onboarding/next-step-icon.svg" width={20} height={23} alt="Next step icon" />
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
            <label htmlFor="title-input">{t("name")}</label>
            <input
              type="text"
              id="community-name-input"
              tabIndex={1}
            />
          </div>
          <div className={"col-02"}>
            <label htmlFor="title-input">{t("avatar")}</label>
            <input
              type="text"
              id="community-avatar-input"
              tabIndex={2}
            />
          </div>
        </section>

        <label htmlFor="title-input">{t("description")}</label>
        <textarea
          type="text"
          id="community-description-input"
          tabIndex={3}
        ></textarea>

        <h3>
          Token
          <i data-tooltip={t('token-tooltip')} className="tooltip-top">
            <Image src="/info-icon.svg" width={16} height={16} alt="Info icon" />
          </i>
        </h3>

        <section className={"columns"}>
          <div className={"col-01"}>
            <label htmlFor="title-input">Smart contract</label>
            <input
              type="text"
              id="smart-contract-input"
              tabIndex={4}
            />
          </div>
          <div className={"col-02"}>
            <label htmlFor="title-input">{t("community-fee")}</label>
            <input
              type="text"
              id="community-fee-input"
              tabIndex={5}
            />
          </div>
        </section>

        <section className={styles["form-footer"]}>
          <a href="#" className={styles["back-link"]}>
            {t("back")}
          </a>
          <button type="submit" className={styles["next-btn"]} tabIndex={6}>
            {t("next-step")}
          </button>
        </section>

      </form>
    </div>
  )
}

export default OnboardingCommunity;
