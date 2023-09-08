import '../styles/globals.css'
import { AccountProvider} from "../components/AccountContext";

import React from "react"

function MyApp({ Component, pageProps }) {
  return (
    <AccountProvider>
      <Component {...pageProps} />
    </AccountProvider>
  )
}

export default MyApp
