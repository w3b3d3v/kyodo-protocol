import Head from 'next/head'
import { VaultContractProvider, AgreementContractProvider } from "../contexts/ContractContext";
import Balances from '../components/dashboard/Balances.js';

export default function Home() {
  return (
    <div>
      <Head>
        <title>App - Kyōdō Protocol</title>
        <meta name="description" content="The Future of Work Powered by Communities" />
        <link rel="icon" href="/logo192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <AgreementContractProvider>
          <VaultContractProvider>
            <Balances />
          </VaultContractProvider>
        </AgreementContractProvider>
      </main>
    </div>
  )
}
