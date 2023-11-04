import {
  useManageSubscription,
  useSubscription,
  useW3iAccount,
  useInitWeb3InboxClient,
  useMessages,
} from "@web3inbox/widget-react"
import { useCallback, useEffect } from "react"
import { useSignMessage, useAccount } from "wagmi"

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID

export default function Web3Inbox({ address }) {
  const { signMessageAsync } = useSignMessage()
  const isReady = useInitWeb3InboxClient({
    // The project ID and domain you setup in the Domain Setup section
    projectId,
    domain: "betapp.kyodoprotocol.xyz",
    // Allow localhost development with "unlimited" mode.
    // This authorizes this dapp to control notification subscriptions for all domains (including `app.example.com`), not just `window.location.host`
    isLimited: false,
  })

  const { account, setAccount, isRegistered, isRegistering, register } = useW3iAccount()

  useEffect(() => {
    if (!address) return
    // Convert the address into a CAIP-10 blockchain-agnostic account ID and update the Web3Inbox SDK with it
    setAccount(`eip155:1:${address}`)
  }, [address, setAccount])

  const performRegistration = useCallback(async () => {
    if (!address) return
    try {
      await register((message) => signMessageAsync({ message }))
    } catch (registerIdentityError) {
      alert(registerIdentityError)
    }
  }, [signMessageAsync, register, address])

  useEffect(() => {
    // Register even if an identity key exists, to account for stale keys
    performRegistration()
  }, [performRegistration])

  const { isSubscribed, isSubscribing, subscribe } = useManageSubscription()

  const performSubscribe = useCallback(async () => {
    // Register again just in case
    await performRegistration()
    await subscribe()
  }, [subscribe, performRegistration])

  const { subscription } = useSubscription()
  const { messages } = useMessages()

  return (
    <>
      {!isReady ? (
        <div>Loading client...</div>
      ) : (
        <>
          {!address ? (
            <div>Connect your wallet</div>
          ) : (
            <>
              <div>Address: {address}</div>
              <div>Account ID: {account}</div>
              {!isRegistered ? (
                <div>
                  To manage notifications, sign and register an identity key:&nbsp;
                  <button onClick={performRegistration} disabled={isRegistering}>
                    {isRegistering ? "Signing..." : "Sign"}
                  </button>
                </div>
              ) : (
                <>
                  {!isSubscribed ? (
                    <>
                      <button onClick={performSubscribe} disabled={isSubscribing}>
                        {isSubscribing ? "Subscribing..." : "Subscribe to notifications"}
                      </button>
                    </>
                  ) : (
                    <>
                      <div>You are subscribed</div>
                      <div>Subscription: {JSON.stringify(subscription)}</div>
                      <div>Messages: {JSON.stringify(messages)}</div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}
