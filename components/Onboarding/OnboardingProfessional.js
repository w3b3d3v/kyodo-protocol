import styles from "./Onboarding.module.scss"
import Image from 'next/image'
import { useTranslation } from "react-i18next"
import { useState } from 'react';
import Link from "next/link"

function saveToCache(data) {
  const dataString = JSON.stringify(data);
  localStorage.setItem('cachedData', dataString);
  console.log(localStorage.getItem('cachedData'));
}

function OnboardingProfessional() {

  const [nameProfessional, setName] = useState('');
  const [bioProfessional, setBio] = useState('');
  const [avatarProfessional, setAvatar] = useState('');
  const [websiteProfessional, setWebsite] = useState('');
  const [communityProfessional, setCommunity] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.value);
  };

  const handleWebsiteChange = (e) => {
    setWebsite(e.target.value);
  };

  const handleCommunityChange = (e) => {
    setCommunity(e.target.value);
  };

  const handleButtonClick = () => {

    const formData = {
      nameProfessional,
      bioProfessional,
      avatarProfessional,
      websiteProfessional,
      communityProfessional
    };

    saveToCache(formData);
  };

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
            <Image
              src="/onboarding/current-icon.svg"
              width={20}
              height={23}
              alt="Current step icon"
            />
            <p>{t("initial-setup")}</p>
          </li>
          <li>
            <Image
              src="/onboarding/next-step-icon.svg"
              width={20}
              height={23}
              alt="Next step icon"
            />
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
            <label htmlFor="professional-name-input">{t("name")} <span>*</span></label>
            <input
              type="text"
              onChange={handleNameChange}
              id="professional-name-input"
              tabIndex={1}
            />
            <label htmlFor="professional-bio-input">{t("bio")} <span>*</span></label>
            <textarea
              type="text"
              onChange={handleBioChange}
              id="professional-bio-input"
              tabIndex={2}
            ></textarea>
          </div>

          <div className={"col-02"}>
            <label htmlFor="professional-avatar-input">{t("avatar")}</label>
            <input
              type="text"
              onChange={handleAvatarChange}
              id="professional-avatar-input"
              tabIndex={3}
            />
            <label htmlFor="professional-website-input">{t("website")}</label>
            <input
              type="text"
              onChange={handleWebsiteChange}
              id="professional-website-input"
              tabIndex={4}
            />
            <label htmlFor="professional-community-input">{t("community")} <span>*</span></label>
            <div className={"custom-select"}>
              <select
                tabIndex={5}
                onChange={handleCommunityChange}
                id="professional-community-input"
              >
                <option>{t("select-option")}</option>
                <option>Phala Network</option>
                <option>Web3dev</option>
              </select>
            </div>
          </div>
        </section>
        <section className={styles["form-footer"]}>
          <Link href="/onboarding/profile-selection" className={styles["back-link"]}>
            {t("back")}
          </Link>
          <button onClick={handleButtonClick} className={styles["next-btn"]} tabIndex={6}>
            {t("next-step")}
          </button>
        </section>
      </form>
    </div>
  )
}

export default OnboardingProfessional;
