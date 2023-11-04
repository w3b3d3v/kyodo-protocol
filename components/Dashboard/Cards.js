import Link from "next/link"
import styles from "./Dashboard.module.scss"
import { useTranslation } from "react-i18next"

function Cards() {
  const { t } = useTranslation()

  return (
    <div className={styles["user-home"]}>
      <ul className={styles["home-calls"]}>
        <li className={styles["disabled"]}>
          <h2>Complete your profile to be visible</h2>
          <div className={styles["progressbar"]}>
            <div></div>
          </div>
          <p>
            You profile is <strong>35%</strong> complete
          </p>
          <Link href="#">Complete profile</Link>
        </li>
        <li>
          <h2>{t("call-02")}</h2>
          <p>{t("phrase-02")}</p>
          <Link href="/agreements/new">{t("btn-02")}</Link>
        </li>
        <li className={styles["disabled"]}>
          <h2>
            Refer and<br></br> earn
          </h2>
          <p>
            Professionals or contractors that refer the usage of Kyodo, can earn a % of paid value
            to the protocol.
          </p>
          <Link href="#">Get referral link</Link>
        </li>
      </ul>
    </div>
  )
}

export default Cards
