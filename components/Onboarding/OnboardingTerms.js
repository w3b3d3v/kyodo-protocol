import styles from "./Onboarding.module.scss"
import Image from 'next/image'
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { useAccount} from "../../contexts/AccountContext";
import { useRouter } from "next/router"

function OnboardingTerms() {

  const { t } = useTranslation()

  const router = useRouter()

  const { completeOnboarding } = useAccount();

  const handleCompleteOnboarding = () => {
    completeOnboarding();
    router.push("/onboarding/complete");
  }

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
          <li className={styles["current-step"]}>
            <Image src="/onboarding/current-icon.svg" width={20} height={23} alt="Next step" />
            <p>{t("terms-conditions")}</p>
          </li>
        </ul>
      </div>

      <ul className={styles["terms-list"]}>
        <li>
          <Image
            src="/onboarding/terms-icon.svg"
            width={57}
            height={57}
            alt="Community icon"
          />
          <h2>{t("code-conduct")}</h2>
          <p>
            <Link
              href="https://www.kyodoprotocol.xyz/code-of-conduct.html" target="_blank">
              {t("view-document")}
            </Link>
          </p>
        </li>
        <li>
          <Image
            src="/onboarding/terms-icon.svg"
            width={57}
            height={57}
            alt="Professional icon"
          />
          <h2>{t("privacy-policy")}</h2>
          <p>
            <Link
              href="https://www.kyodoprotocol.xyz/privacy-policy.html" target="_blank">
              {t("view-document")}
            </Link>
          </p>
        </li>
        <li>
          <Image
            src="/onboarding/terms-icon.svg"
            width={57}
            height={57}
            alt="Contractor icon"
          />
          <h2>{t("terms-use")}</h2>
          <p>
            <Link href="https://www.kyodoprotocol.xyz/terms-of-use.html" target="_blank">
              {t("view-document")}
            </Link>
          </p>
        </li>
      </ul>

      <section className={styles["form-footer"]}>
        <Link href="/onboarding/profile-selection" className={styles["back-link"]}>
          {t("back")}
        </Link>
        <Link onClick={handleCompleteOnboarding} href="#" className={styles["i-agree-btn"]}>
          {t("i-agree")}
        </Link>
      </section>

    </div>
  )
}

export default OnboardingTerms;
