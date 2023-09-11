import Head from 'next/head'
import UserCheck from "../components/UserCheck/UserCheck"

export default function Home() {
  return (
    <div>
      <Head>
        <title>App - Kyōdō Protocol</title>
        <meta name="description" content="The Future of Work Powered by Communities" />
        <link rel="icon" href="/logo192.png" />
      </Head>
      <main>
        <UserCheck />
      </main>
    </div>
  )
}
