import React, { useState } from 'react';
import '../styles/globals.scss'
import Image from 'next/image'
import { AccountProvider, useAccount} from "../contexts/AccountContext";
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import { ConnectWalletButton } from "../components/ConnectWalletButton/ConnectWalletButton"
import "../i18n" // Adjust the path based on where you placed i18n.js

function formatAddress(address) {
  if (!address) return ""
  const start = address.substring(0, 4)
  const end = address.substring(address.length - 4)
  return `${start}...${end}`
}

function PageContent({ Component, pageProps }) {
  const { account, setAccount, selectedChain, setSelectedChain } = useAccount();

  return (
    <>
      {account ? (
        <div>
          <Header />
          <Component {...pageProps} />
        </div>
      ) : (
        <div>
          <ConnectWalletButton value={{ account, setAccount, selectedChain, setSelectedChain }}/>
        </div>
      )}
    </>
  );
}


function Header() {
  const { account } = useAccount()
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const { locale } = router
  const currentLanguage = i18n.language

  function changeLanguage() {
    const newLocale = currentLanguage === "en-US" ? "pt-BR" : "en-US"
    i18n.changeLanguage(newLocale)
    router.push(router.pathname, router.asPath, { locale: newLocale }) // Update Next.js router locale
  }

  // Mobile menu
  const [visibleMenu, setVisibleMenu] = useState(true);
  const toggleElement = () => {
    setVisibleMenu(!visibleMenu);
  };

  return (
    <AccountProvider>
      <header className={"main-header"}>
        <div className={"holder"}>
          <Image
            src="/logo.svg"
            alt="Kyodo Protocol logo"
            width={120}
            height={32}
            className={"logo"}
          />
          <Image
            src="/menu-icon.svg"
            alt="menu icon"
            width={30}
            height={30}
            className={"menu-trigger"}
            onClick={toggleElement}
          />
          <div className={"user-wallet"}>
            <em>{formatAddress(account)}</em>
            <span className={"wallet-on"}>Status</span>
            <Image src="/metamask.svg" alt="Metamask icon" width={22} height={19} />
          </div>
          
          {visibleMenu &&
          <nav>
            <ul>
              <li>
                <a href="/">{t("dashboard")}</a>
              </li>
              <li>
                <a href="/agreements">{t("agreements")}</a>
              </li>
              <li>
                <a onClick={changeLanguage} className={"local-trigger"}>{locale}</a>
              </li>
            </ul>
          </nav>
          }

        </div>
      </header>
    </AccountProvider>
  )
}

function MyApp({ Component, pageProps }) {
  return (
    <AccountProvider>
      <PageContent Component={Component} pageProps={pageProps} />
      <footer>
        <div className={"holder"}>
          <p>
            <Image
              src="/web3dev.svg"
              alt="WEB3DEV"
              width={17}
              height={27}
            />
            &copy; 2023 WEB3DEV
          </p>
          <ul>
            <li>
              <a href="https://www.kyodoprotocol.xyz/code-of-conduct.html" target="_blank">
                Code of conduct 
              </a>
            </li>
            <li>
              <a href="https://www.kyodoprotocol.xyz/privacy-policy.html" target="_blank">
                Privacy policy
              </a>
            </li>
            <li>
              <a href="https://www.kyodoprotocol.xyz/terms-of-use.html" target="_blank">
                Terms of use
              </a>        
            </li>
          </ul>
        </div>
      </footer>
    </AccountProvider>
  );
}

export default MyApp
