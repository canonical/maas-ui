import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachinesHeader from "./MachinesHeader";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";

const mockStore = configureStore();

describe("MachinesHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        loaded: true,
        counts: factory.machineStateCounts({
          "mocked-nanoid": factory.machineStateCount({
            count: 2,
            loaded: true,
            loading: false,
          }),
        }),
        items: [
          factory.machine({ system_id: "abc123" }),
          factory.machine({ system_id: "def456" }),
        ],
        statuses: {
          abc123: factory.machineStatus({}),
          def456: factory.machineStatus({}),
        },
      }),
    });
  });

  it("renders", () => {
    state.machine.loaded = true;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachinesHeader machineCount={2} title="Machines" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("section-header-title")).toHaveTextContent(
      "Machines"
    );
  });
});
