import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import * as queries from "./queries";

type ChainKey = keyof typeof KyodoGraph.clients;

interface Agreement {
  id: string;
  company: string;
  professional: string;
  amount: number;
  transactionHash: string;
  agreementId: string;
  blockNumber: number;
  blockTimestamp: number;
}

class KyodoGraph {
  private static _getApolloClient(uri?: string) {
    const client = new ApolloClient({
      uri,
      cache: new InMemoryCache(),
    });

    return client;
  }

  public static readonly clients = {
    "80001": this._getApolloClient(
      process.env.NEXT_PUBLIC_KYODO_MUMBAI_SUBGRAPH_URI
    ), 
    "11155111": this._getApolloClient(
      process.env.NEXT_PUBLIC_KYODO_SEPOLIA_SUBGRAPH_URI
    ),
  };

  private static readonly chains: ChainKey[] = ["80001", "11155111"];

  static async fetchPaidAgreements(wallet: string) {
    let allAgreements: (Agreement & { originChain: string })[] = [];

    for (const chain of this.chains) {
      const client = this.clients[chain];
      const response = await client.query({
        query: queries.GET_PAID_AGREEMENTS_QUERY,
        variables: { wallet },
        fetchPolicy: "cache-first",
      });

      const agreements: Agreement[] = response?.data.paymentMades ?? [];
      const agreementsWithOrigin = agreements.map((agreement: Agreement) => ({
        ...agreement,
        originChain: chain
      }));

      allAgreements = [...allAgreements, ...agreementsWithOrigin];
    }

    return allAgreements;
  }
}

export default KyodoGraph;
