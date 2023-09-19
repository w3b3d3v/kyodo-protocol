import '../styles/globals.scss'
import Image from 'next/image'
import { AccountProvider, useAccount} from "../contexts/AccountContext";

import React from "react"

function formatAddress(address) {
  if (!address) return '';
  const start = address.substring(0, 4);
  const end = address.substring(address.length - 4);
  return `${start}...${end}`;
}

function Header() {
  const { account } = useAccount();

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
          <div className={"user-wallet"}>
            <em>{formatAddress(account)}</em>
            <span className={"wallet-on"}>Status</span>
            <Image
              src="/metamask.svg"
              alt="Metamask icon"
              width={22}
              height={19}
            />
          </div>
          <nav>
            <ul>
              <li>
                <a href="/">
                  Home    
                </a>                  
              </li>
              <li>
                <a href="/agreements">
                  Agreements    
                </a>                  
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </AccountProvider>
  )
}

function MyApp({ Component, pageProps }) {
  return (
    <AccountProvider>
      <Header />
      <Component {...pageProps} />
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
              <a href="https://www.kyodoprotocol.xyz/code-of-conduct.html">
                Code of conduct 
              </a>
            </li>
            <li>
              <a href="https://www.kyodoprotocol.xyz/privacy-policy.html">
                Privacy policy
              </a>
            </li>
            <li>
              <a href="https://www.kyodoprotocol.xyz/terms-of-use.html">
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
