import { http, HttpResponse } from "msw";

import type {
  ListDiscoveriesError,
  ListDiscoveriesResponse,
  ListZonesWithSummaryError,
} from "@/app/apiclient";
import { discovery as discoveryFactory } from "@/testing/factories";
import { BASE_URL } from "@/testing/utils";

const mockNetworkDiscoveries: ListDiscoveriesResponse = {
  items: [discoveryFactory(), discoveryFactory(), discoveryFactory()],
  total: 3,
};

const mockListDiscoveriesError: ListDiscoveriesError = {
  message: "Unauthorized",
  code: 401,
  kind: "Error", // This will always be 'Error' for every error response
};

const networkDiscoveryResolvers = {
  listNetworkDiscoveries: {
    resolved: false,
    handler: (data: ListDiscoveriesResponse = mockNetworkDiscoveries) =>
      http.get(`${BASE_URL}MAAS/a/v3/discoveries`, () => {
        networkDiscoveryResolvers.listNetworkDiscoveries.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListZonesWithSummaryError = mockListDiscoveriesError) =>
      http.get(`${BASE_URL}MAAS/a/v3/discoveries`, () => {
        networkDiscoveryResolvers.listNetworkDiscoveries.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { networkDiscoveryResolvers, mockNetworkDiscoveries };
