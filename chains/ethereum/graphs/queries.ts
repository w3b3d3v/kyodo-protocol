import { gql } from "@apollo/client";

export const GET_PAID_AGREEMENTS_QUERY = gql`
  query getPaymentMades($wallet: String!) {
    paymentMades(
      where: { or: [{ company: $wallet }, { professional: $wallet }] }
    ) {
      id
      company
      professional
      amount
      transactionHash
      agreementId
      blockNumber
      blockTimestamp
    }
  }
`;
