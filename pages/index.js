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
          <h1>GM, mate!</h1>
          <ul className="home-calls">
            <li className="disabled">
              <h2>Complete your profile to be visible</h2>
              <div className="progressbar">
                <div></div>
              </div>
              <p>You profile is <strong>35%</strong> complete</p>
              <a href="#">Complete profile</a>
            </li>
            <li>
              <h2>Add an agreement</h2>
              <p>Start adding your first agreement.</p>
              <a href="#">Add agreement</a>
            </li>
            <li className="disabled">
              <h2>Refer and<br></br> earn</h2>
              <p>Professionals or contractors that refer the usage of Kyodo, can earn a % of paid value to the protocol.</p>
              <a href="#">Get referral link</a>
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}
