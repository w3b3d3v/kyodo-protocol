import styles from "./Onboarding.module.scss"
import Image from 'next/image'
import Link from "next/link"
import { useTranslation } from "react-i18next"

function OnboardingComplete() {

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
          <li className={styles["done-step"]}>
            <Image src="/onboarding/checked-icon.svg" width={20} height={23} alt="Done" />
            <p>{t("initial-setup")}</p>
          </li>
          <li className={styles["done-step"]}>
            <Image src="/onboarding/checked-icon.svg" width={20} height={23} alt="Done" />
            <p>{t("terms-conditions")}</p>
          </li>
        </ul>
      </div>

      <div className={styles["onboarding-success"]}>
        <Image src="/onboarding/big-success-icon.svg" width={100} height={100} alt="Success!" />
        <p>{t("onboarding-success")}</p>
        <p>
          <Link href="/dashboard" className={"view-all"}>
            {t("dashboard")}
          </Link>
        </p>
      </div>

    </div>
  )
}

export default OnboardingComplete;
