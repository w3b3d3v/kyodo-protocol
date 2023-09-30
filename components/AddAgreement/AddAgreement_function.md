### 1. `addAgreement` function:

This is an asynchronous function that performs the following steps:

- It creates a `details` object which holds the agreement details.
- It defines a callback function `onConfirmation` which will be called once the transaction is confirmed. This function logs the transaction receipt, resets various state variables, and then redirects the user to the `/agreements` route after a delay of 3 seconds.
- It then invokes the `sendTransaction` function to initiate the blockchain transaction. The arguments provided are the function name ("addAgreement"), the agreement details, the event name ("AgreementCreated"), and the `onConfirmation` callback.