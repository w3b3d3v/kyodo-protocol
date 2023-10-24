import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import * as dto from "./dto";
import * as queries from "./queries";

class KyodoGraph {
  private static _getApolloClient(uri?: string) {
    const client = new ApolloClient({
      uri,
      cache: new InMemoryCache(),
    });

    return client;
  }

  private static readonly clients: {
    [k in dto.TGraphChainIds]: ApolloClient<any>;
  } = {
    "80001": this._getApolloClient(
      process.env.NEXT_PUBLIC_KYODO_MUMBAI_SUBGRAPH_URI
    ),
  };

  static async fetchPaidAgreements(chain: dto.TGraphChainIds, wallet: string) {
    const response = await this.clients[chain].query({
      query: queries.GET_PAID_AGREEMENTS_QUERY,
      variables: {
        wallet,
      },
      fetchPolicy: "cache-first",
    });

    // console.log("response",response);

    return response?.data.paymentMades ?? [];
  }
}

export default KyodoGraph;
