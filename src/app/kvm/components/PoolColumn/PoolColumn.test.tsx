import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import PoolColumn from "./PoolColumn";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";

const mockStore = configureStore();

describe("PoolColumn", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = factory.rootState({
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
      zone: factory.zoneState({
        items: [
          factory.zone({
            id: 1,
            name: "alone-zone",
          }),
        ],
      }),
    });
  });

  it("can display the pod's resource pool and zone", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <PoolColumn
          poolId={state.pod.items[0].pool}
          zoneId={state.pod.items[0].zone}
        />
      </Provider>
    );
    expect(screen.getByTestId("pool")).toHaveTextContent("swimming-pool");
    expect(screen.getByTestId("zone")).toHaveTextContent("alone-zone");
  });
});
