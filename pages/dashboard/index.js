import Balances from "../../components/Dashboard/Balances.js"
import Cards from "../../components/Dashboard/Cards.js"
import Payments from "../../components/Dashboard/Payments.js"

function Dashboard() {
  return (
    <div>
      <section className={"user-home"}>
        <Cards />
        <Payments limit={2} />
      </section>
    </div>
  )
}

export default Dashboard
