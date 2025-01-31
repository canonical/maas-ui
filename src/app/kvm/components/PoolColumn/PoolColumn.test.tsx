import { screen } from "@testing-library/react";

import PoolColumn from "./PoolColumn";

import { zoneResolvers } from "@/app/api/query/zones.test";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  renderWithBrowserRouter,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(zoneResolvers.getZone.handler());

beforeAll(() => mockServer.listen({ onUnhandledRequest: "warn" }));
afterEach(() => {
  mockServer.resetHandlers();
});
afterAll(() => mockServer.close());

describe("PoolColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      pod: factory.podState({
        items: [
          factory.pod({
            name: "1",
            pool: 1,
            zone: 1,
          }),
        ],
      }),
      resourcepool: factory.resourcePoolState({
        items: [
          factory.resourcePool({
            id: 1,
            name: "swimming-pool",
          }),
        ],
      }),
    });
  });

  it("can display the pod's resource pool and zone", async () => {
    renderWithBrowserRouter(
      <PoolColumn
        poolId={state.pod.items[0].pool}
        zoneId={state.pod.items[0].zone}
      />,
      { state }
    );
    await waitFor(() => expect(zoneResolvers.getZone.resolved).toBeTruthy());
    expect(screen.getByTestId("pool")).toHaveTextContent("swimming-pool");
    expect(screen.getByTestId("zone")).toHaveTextContent("zone-1");
  });
});
