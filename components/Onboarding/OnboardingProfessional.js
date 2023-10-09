import styles from "./Onboarding.module.scss"
import Image from 'next/image'
import { useTranslation } from "react-i18next"

function OnboardingProfessional() {

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

        <h2 className={styles["professional-heading"]}>
          <span>{t("professional")}</span>
          <hr></hr>
        </h2>

        <h3>{t("personal-info")}</h3>

        <section className={"columns"}>

          <div className={"col-01"}>
            <label htmlFor="title-input">{t("name")}</label>
            <input
              type="text"
              id="title-input"
              tabIndex={1}
            />
            <label htmlFor="title-input">{t("bio")}</label>
            <textarea
              type="text"
              id="title-input"
              tabIndex={1}
            ></textarea>
          </div>

          <div className={"col-02"}>
            <label htmlFor="title-input">{t("avatar")}</label>
            <input
              type="text"
              id="title-input"
              tabIndex={1}
            />
            <label htmlFor="title-input">{t("website")}</label>
            <input
              type="text"
              id="title-input"
              tabIndex={1}
            />
            <label htmlFor="title-input">{t("community")}</label>
            <input
              type="text"
              id="title-input"
              tabIndex={1}
            />
          </div>
        </section>
        <section className={styles["form-footer"]}>
          <a href="#" className={styles["back-link"]}>
            {t("back")}
          </a>
          <button type="submit" className={styles["next-btn"]} tabIndex={8}>
            {t("next-step")}
          </button>
        </section>
      </form>
    </div>
  )
}

export default OnboardingProfessional;
