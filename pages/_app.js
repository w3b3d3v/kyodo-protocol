import '../styles/globals.css'
import { AccountProvider} from "../contexts/AccountContext";

import React from "react"

function MyApp({ Component, pageProps }) {
  return (
    <AccountProvider>
      <Component {...pageProps} />
    </AccountProvider>
  )
}

export default MyApp
