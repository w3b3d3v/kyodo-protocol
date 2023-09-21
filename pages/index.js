import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>App - Kyōdō Protocol</title>
        <meta name="description" content="The Future of Work Powered by Communities" />
        <link rel="icon" href="/logo192.png" />
      </Head>
      <main>
        <section className="user-home">
          <h1>Hi, Josy</h1>
          <ul className="home-calls">
            <li>
              <h2>Complete your profile to be visible</h2>
              <p>You profile is <strong>35%</strong> complete</p>
            </li>
            <li>
              <h2>Validate your experience</h2>
              <p>With ZKP you can prove your skills and experience minting a NFT to display it in your profile.</p>
            </li>
            <li>
              <h2>Refer and earn</h2>
              <p>Professionals or contractors that refer the usage of Kyodo, can earn a % of paid value to the protocol.</p>
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}
