import React, { useState, useEffect} from 'react';
import '../styles/globals.scss'
import Image from 'next/image'
import Link from 'next/link';
import { AccountProvider, useAccount} from "../contexts/AccountContext";
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import { ConnectWalletButton } from "../components/ConnectWalletButton/ConnectWalletButton"
import "../i18n" // Adjust the path based on where you placed i18n.js
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Head from "next/head"

function formatAddress(address) {
  return address ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}` : ""
}

function PageContent({ Component, pageProps }) {
  const router = useRouter()
  const { account, setAccount, selectedChain, setSelectedChain, isOnboardingComplete } =
    useAccount()

  if (account && !isOnboardingComplete && !router.pathname.startsWith("/onboarding")) {
    router.push("/onboarding")
    return null
  }

  return (
    <>
      {account ? (
        <div>
          <Header />
          <Component {...pageProps} />
        </div>
      ) : (
        <div>
          <ConnectWalletButton value={{ account, setAccount, selectedChain, setSelectedChain }} />
        </div>
      )}
    </>
  )
}

function Header() {
  const { account, selectedChain } = useAccount()
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const { locale } = router
  const currentLanguage = i18n.language

  function changeLanguage() {
    const newLocale = currentLanguage === "en-US" ? "pt-BR" : "en-US"
    i18n.changeLanguage(newLocale)
    router.push(router.pathname, router.asPath, { locale: newLocale }) // Update Next.js router locale
  }

  // Mobile header and footer

  const mobileScreenWidth = 800
  const isSmallScreen = window.innerWidth <= mobileScreenWidth

  const [visibleMenu, setVisibleMenu] = useState(!isSmallScreen)
  const [visibleFooter, setVisibleFooter] = useState(!isSmallScreen)

  const toggleElement = () => {
    setVisibleMenu(!visibleMenu)
    setVisibleFooter(!visibleFooter)
  }

  return (
    <div>
      <header className={"main-header"}>
        <div className={"holder"}>
          <Image
            src="/logo.svg"
            alt="Kyodo Protocol logo"
            width={49}
            height={49}
            className={"logo"}
          />
          <div className={"header-right"}>
            {visibleMenu && (
              <nav>
                <Image
                  src="/logo-mobile.svg"
                  alt="Kyodo logo"
                  width={100}
                  height={56}
                  className={"logo-mobile"}
                />
                <ul>
                  <li>
                    <Link href="/dashboard">{t("dashboard")}</Link>
                  </li>
                  <li>
                    <Link href="/agreements">{t("agreements")}</Link>
                  </li>
                  <li>
                    <a onClick={changeLanguage} className={"local-trigger"}>
                      {locale}
                    </a>
                  </li>
                </ul>
              </nav>
            )}
            {selectedChain == "solana" ? (
              <WalletMultiButton />
            ) : (
              <div className={"user-wallet"}>
                <Link href="#" className={"select-chain"} onClick={() => setShowModal(true)}>
                  Select chain
                  <Image
                    src="/arrow-down.svg"
                    alt="Select chain"
                    width={11}
                    height={11}
                  />
                </Link>
                <div>
                  <span className={"wallet-on"}>Status</span>
                  <em>{formatAddress(account)}</em>
                  <Image src="/metamask.svg" alt="Metamask icon" width={22} height={19} />
                </div>
              </div>
            )}
            <Image
              src="/menu-icon.svg"
              alt="menu icon"
              width={30}
              height={30}
              className={"menu-trigger"}
              onClick={toggleElement}
            />
          </div>
        </div>
      </header>
      {visibleFooter && (
        <footer>
          <div className={"holder"}>
            <p>
              <Image src="/web3dev.svg" alt="WEB3DEV" width={17} height={27} />
              <Link href="https://pt.w3d.community/" target="_blank" className={"web3dev-link"}>
                &copy; 2023 WEB3DEV
              </Link>
            </p>
            <ul>
              <li>
                <Link href="https://www.kyodoprotocol.xyz/code-of-conduct.html" target="_blank">
                  {t("code-conduct")}
                </Link>
              </li>
              <li>
                <Link href="https://www.kyodoprotocol.xyz/privacy-policy.html" target="_blank">
                  {t("privacy-policy")}
                </Link>
              </li>
              <li>
                <Link href="https://www.kyodoprotocol.xyz/terms-of-use.html" target="_blank">
                  {t("terms-use")}
                </Link>
              </li>
            </ul>
          </div>
        </footer>
      )}
    </div>
  )
}

function MyApp({ Component, pageProps }) {

  return (
    <AccountProvider>
      <Head>
        <title>App - Kyōdō Protocol</title>
      </Head>
      <PageContent Component={Component} pageProps={pageProps} />
    </AccountProvider>
  );
}

export default MyApp
