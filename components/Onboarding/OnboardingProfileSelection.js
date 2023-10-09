import { useAccount } from "../../contexts/AccountContext";
import styles from "./Onboarding.module.scss"
import Image from 'next/image'

function OnboardingProfileSelection() {

  return (
    <div className={styles["onboarding"]}>

      <div className={styles["onboarding-steps"]}>
        <h1>Welcome to <strong>Kyōdō</strong></h1>
        <ul>
          <li className={styles["done-step"]}>
            <Image src="/onboarding/checked-icon.svg" width={20} height={23} alt="Done icon" />
            <p>Connect <span>wallet</span></p>
          </li>
          <li className={styles["current-step"]}>
            <Image src="/onboarding/current-icon.svg" width={20} height={23} alt="Current step icon" />
            <p>Profile <span>selection</span></p>
          </li>
          <li>
            <Image src="/onboarding/next-step-icon.svg" width={20} height={23} alt="Next step icon" />
            <p>Initial <span>setup</span></p>
          </li>
          <li>
            <Image src="/onboarding/next-step-icon.svg" width={20} height={23} alt="Next step icon" />
            <p>Terms & <span>Conditions</span></p>
          </li>
        </ul>
      </div>

      <ul className={styles["roles-list"]}>
        <li className={styles["community-call"]}>
          <Image src="/onboarding/community-call-icon.svg" width={57} height={57} alt="Community icon" />
          <h2>Community</h2>
          <p>Implement the protocol</p>
          <a href="#">Get started</a>
        </li>
        <li className={styles["professional-call"]}>
          <Image src="/onboarding/professional-call-icon.svg" width={57} height={57} alt="Professional icon" />
          <h2>Professional</h2>
          <p>Get a job and career help</p>
          <a href="#">Get started</a>
        </li>
        <li className={styles["contractor-call"]}>
          <Image src="/onboarding/contractor-call-icon.svg" width={57} height={57} alt="Contractor icon" />
          <h2>Contractor</h2>
          <p>Hire a talent / Build a team</p>
          <a href="#">Get started</a>
        </li>
      </ul>

    </div>
  )
}

export default OnboardingProfileSelection;
