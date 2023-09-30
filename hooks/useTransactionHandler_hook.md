### 1. `useTransactionHandler` function:

This is a custom React hook that encapsulates the logic for handling blockchain transactions. Here's a step-by-step breakdown:

- It initializes state variables using the `useState` hook to manage the transaction's lifecycle (e.g., loading state, success, pending, failure, etc.).
- It retrieves the user's account and selected blockchain chain from the `useAccount` hook.
- It also retrieves the contract instance from the `useAgreementContract` hook.
- The `sendTransaction` function is defined using the `useCallback` hook to ensure that it doesn't get recreated on every render. This function handles the process of sending a transaction and waiting for its confirmation:

  1. It sets the initial states (loading, no transaction failures, etc.).
  2. It defines timeouts for the transaction and for waiting for an event.
  3. Using `Promise.race`, it either sends the transaction (via `transactionManager`) or rejects if the transaction takes too long.
  4. If the transaction is sent successfully and its hash is available, it sets up an event listener to wait for the transaction's confirmation.
  5. If the transaction confirmation event is received within the timeout, it sets the success state and calls the provided `onConfirmation` callback.
  6. If there's an error (e.g., timeout or other issues), it handles the error and sets the appropriate state variables.
  7. Finally, it resets the loading state after a 3-second delay.

- The hook returns various state variables and the `sendTransaction` function so that they can be used in the component that utilizes this hook.

In essence, this code provides a way to add an agreement to the blockchain and manage the transaction's lifecycle, including loading, success, failure, and pending states. The custom hook (`useTransactionHandler`) abstracts away the details of sending a transaction, listening for its confirmation, and updating the relevant states, allowing for clean and reusable code in React components.