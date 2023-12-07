import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import * as queries from "./queries";

const chainsConfig = require('../../chainConfig.json');

type ChainConfig = {
  name: string;
  logo: string;
  tokens: any[];
  subgraphUrl: string;
  blockExplorer: {
    name: string;
    url: string;
  };
};

type ChainsConfig = {
  [chainId: string]: ChainConfig;
};

const config: ChainsConfig = chainsConfig;

type ChainKey = keyof typeof KyodoGraph.clients;

interface Agreement {
  id: string;
  targetChain: string;
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

  public static readonly clients = Object.fromEntries(
    Object.entries(chainsConfig).map(([chainId, config]) => [
      chainId, this._getApolloClient((config as ChainConfig).subgraphUrl)
    ])
  );

  // private static readonly chains: ChainKey[] = ["80001", "11155111", "43113", "97"];
  private static readonly chains: ChainKey[] = ["80001", "43113", "97"];

  static async fetchPaidAgreements(wallet: string) {
    let allAgreements: (Agreement & { originChain: string })[] = [];

    for (const chain of this.chains) {
      console.log("chain: ", chain)
      const client = this.clients[chain];
      const response = await client.query({
        query: queries.GET_PAID_AGREEMENTS_QUERY,
        variables: { wallet },
        fetchPolicy: "cache-first",
      });

      const agreements: Agreement[] = response?.data.paymentMades ?? [];
      const agreementsWithOrigin = agreements.map((agreement: Agreement) => ({
        ...agreement,
        originChain: chain.toString()
      }));

      allAgreements = [...allAgreements, ...agreementsWithOrigin];
    }

    return allAgreements;
  }
}

export default KyodoGraph;
