import styles from "./Onboarding.module.scss"
import Image from 'next/image'
import { useTranslation } from "react-i18next"

function OnboardingContractor() {

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
            <Image src="/onboarding/current-icon.svg" width={20} height={23} alt="Current step icon" />
            <p>{t("initial-setup")}</p>
          </li>
          <li>
            <Image src="/onboarding/next-step-icon.svg" width={20} height={23} alt="Next step icon" />
            <p>{t("terms-conditions")}</p>
          </li>
        </ul>
      </div>

      <form className={styles["onboarding-form"]}>

        <h2 className={styles["contractor-heading"]}>
          <span>{t("contractor")}</span>
          <hr></hr>
        </h2>

        <h3>{t("personal-info")}</h3>

        <section className={"columns"}>

          <div className={"col-01"}>
            <label htmlFor="contractor-name-input">{t("name")}</label>
            <input
              type="text"
              id="contractor-name-input"
              tabIndex={1}
            />
            <label htmlFor="contractor-bio-input">{t("bio")}</label>
            <textarea
              type="text"
              id="contractor-bio-input"
              tabIndex={2}
            ></textarea>
          </div>

          <div className={"col-02"}>
            <label htmlFor="contractor-avatar-input">{t("avatar")}</label>
            <input
              type="text"
              id="contractor-avatar-input"
              tabIndex={3}
            />
            <label htmlFor="conntractor-website-input">{t("website")}</label>
            <input
              type="text"
              id="contractor-website-input"
              tabIndex={4}
            />
            <label htmlFor="contractor-community-input">{t("community")}</label>
            <input
              type="text"
              id="contractor-community-input"
              tabIndex={5}
            />
          </div>
        </section>
        <section className={styles["form-footer"]}>
          <a href="/onboarding/profile-selection" className={styles["back-link"]}>
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

export default OnboardingContractor;
