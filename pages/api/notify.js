const notificationTypes = {
  payment: "91c35de2-ddfd-4756-a54b-3a1dc52993d4",
  job: "68b107bf-c219-4b86-8f64-f5b67da4ee34",
  agreement: "c13da13c-443c-4467-b6ce-67c470edc391",
}

function description(type, params) {
  switch (type) {
    case "payment":
      return `Payment of ${params.value} received`
    case "job":
      return "New Job Listed"
    case "agreement":
      return "New Agreement created for you"
    default:
      return "New Notification"
  }
}
export default async function handler(req, res) {
  const { account, type } = req.query

  const response = await fetch(
    `https://notify.walletconnect.com/${process.env.NEXT_PUBLIC_WC_PROJECT_ID}/notify`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTIFY_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notification: {
          type: notificationTypes[type], // Notification type ID copied from Cloud
          title: "New " + type,
          body: description(type, req.query),
          icon: "https://betapp.kyodoprotocol.xyz/logo-square.svg", // optional
          url: "https://betapp.kyodoprotocol.xyz", // optional
        },
        accounts: [
          `eip155:1:${account}`, // CAIP-10 account ID
        ],
      }),
    }
  )

  const body = await response.text()
  console.log(body)
  res.status(200).json({})
}
