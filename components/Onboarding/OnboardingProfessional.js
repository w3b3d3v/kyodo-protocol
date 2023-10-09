import { useAccount } from "../../contexts/AccountContext";
import styles from "./Onboarding.module.scss"
import Image from 'next/image'

function OnboardingProfessional() {

  return (
    <div className={styles["onboarding"]}>

      <div className={styles["onboarding-steps"]}>
        <h1>Welcome to <strong>Kyōdō</strong></h1>
        <ul>
          <li className={styles["done-step"]}>
            <Image src="/onboarding/checked-icon.svg" width={20} height={23} alt="Done icon" />
            <p>Connect <span>wallet</span></p>
          </li>
          <li className={styles["done-step"]}>
            <Image src="/onboarding/checked-icon.svg" width={20} height={23} alt="Done step icon" />
            <p>Profile <span>selection</span></p>
          </li>
          <li className={styles["current-step"]}>
            <Image src="/onboarding/next-step-icon.svg" width={20} height={23} alt="Current step icon" />
            <p>Initial <span>setup</span></p>
          </li>
          <li>
            <Image src="/onboarding/next-step-icon.svg" width={20} height={23} alt="Next step icon" />
            <p>Terms & <span>Conditions</span></p>
          </li>
        </ul>
      </div>

      <form className={styles["onboarding-form"]}>

        <h2 className={styles["professional-heading"]}>
          <span>Professional</span>
          <hr></hr>
        </h2>

        <h3>Personal info</h3>

        <section className={"columns"}>

          <div className={"col-01"}>
            <label htmlFor="title-input">Name</label>
            <input
              type="text"
              id="title-input"
              tabIndex={1}
            />
            <label htmlFor="title-input">Bio</label>
            <textarea
              type="text"
              id="title-input"
              tabIndex={1}
            ></textarea>
          </div>

          <div className={"col-02"}>
            <label htmlFor="title-input">Avatar URL</label>
            <input
              type="text"
              id="title-input"
              tabIndex={1}
            />
            <label htmlFor="title-input">Website / portfólio</label>
            <input
              type="text"
              id="title-input"
              tabIndex={1}
            />
            <label htmlFor="title-input">Community</label>
            <input
              type="text"
              id="title-input"
              tabIndex={1}
            />
          </div>
        </section>
        <section className={styles["form-footer"]}>
          <a href="#" className={styles["back-link"]}>
            Back
          </a>
          <button type="submit" className={styles["next-btn"]} tabIndex={8}>
            Next step
          </button>
        </section>
      </form>
    </div>
  )
}

export default OnboardingProfessional;
