import styles from "./Onboarding.module.scss"
import Image from 'next/image'
import { useTranslation } from "react-i18next"

function OnboardingProfileSelection() {



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
          <li className={styles["current-step"]}>
            <Image src="/onboarding/current-icon.svg" width={20} height={23} alt="Current step icon" />
            <p>{t("profile-selection")}</p>
          </li>
          <li>
            <Image src="/onboarding/next-step-icon.svg" width={20} height={23} alt="Next step icon" />
            <p>{t("initial-setup")}</p>
          </li>
          <li>
            <Image src="/onboarding/next-step-icon.svg" width={20} height={23} alt="Next step icon" />
            <p>{t("terms-conditions")}</p>
          </li>
        </ul>
      </div>

      <ul className={styles["roles-list"]}>
        <li className={styles["community-call"]}>
          <Image src="/onboarding/community-call-icon.svg" width={57} height={57} alt="Community icon" />
          <h2>{t("community")}</h2>
          <p>{t("community-call")}</p>
          <a href="/onboarding/community">{t("get-started")}</a>
        </li>
        <li className={styles["professional-call"]}>
          <Image src="/onboarding/professional-call-icon.svg" width={57} height={57} alt="Professional icon" />
          <h2>{t("professional")}</h2>
          <p>{t("professional-call")}</p>
          <a href="/onboarding/professional">{t("get-started")}</a>
        </li>
        <li className={styles["contractor-call"]}>
          <Image src="/onboarding/contractor-call-icon.svg" width={57} height={57} alt="Contractor icon" />
          <h2>{t("contractor")}</h2>
          <p>{t("contractor-call")}</p>
          <a href="/onboarding/contractor">{t("get-started")}</a>
        </li>
      </ul>

    </div>
  )
}

export default OnboardingProfileSelection;
