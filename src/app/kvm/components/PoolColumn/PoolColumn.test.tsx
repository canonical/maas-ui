import { screen } from "@testing-library/react";

import PoolColumn from "./PoolColumn";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter } from "@/testing/utils";

describe("PoolColumn", () => {
  let state: RootState;
  const queryData = {
    zones: [
      factory.zone({
        id: 1,
        name: "alone-zone",
      }),
    ],
  };
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

  it("can display the pod's resource pool and zone", () => {
    renderWithBrowserRouter(
      <PoolColumn
        poolId={state.pod.items[0].pool}
        zoneId={state.pod.items[0].zone}
      />,
      { state, queryData }
    );
    expect(screen.getByTestId("pool")).toHaveTextContent("swimming-pool");
    expect(screen.getByTestId("zone")).toHaveTextContent("alone-zone");
  });
});
