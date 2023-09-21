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
              <p>Complete your profile to be visible</p>
            </li>
            <li>
              <p>Validate your experience</p>
            </li>
            <li>
              <p>Refer and earn</p>
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}
