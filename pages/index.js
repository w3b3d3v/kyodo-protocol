import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title>App - Kyōdō Protocol</title>
        <meta name="description" content="The Future of Work Powered by Communities" />
        <link rel="icon" href="/logo192.png" />
      </Head>
      <main className={styles.main}>
        Home
      </main>
    </div>
  )
}
