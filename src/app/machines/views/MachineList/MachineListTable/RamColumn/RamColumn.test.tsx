import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";

import { RamColumn } from "./RamColumn";

import type { RootState } from "app/store/root/types";
import { TestStatusStatus } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

describe("RamColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
            memory: 8,
            memory_test_status: testStatusFactory({
              status: 2,
            }),
          }),
        ],
      }),
    });
  });

  it("renders", () => {
    const store = mockStore(state);
    const { container } = renderWithBrowserRouter(
      <RamColumn systemId="abc123" />,
      { route: "/machines", store }
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("displays ram amount", () => {
    state.machine.items[0].memory = 16;
    const store = mockStore(state);

    renderWithBrowserRouter(<RamColumn systemId="abc123" />, {
      route: "/machines",
      store,
    });

    expect(screen.getByTestId("memory")).toHaveTextContent("16");
  });

  it("displays an error and tooltip if memory tests have failed", () => {
    state.machine.items[0].memory = 16;
    state.machine.items[0].memory_test_status = testStatusFactory({
      status: TestStatusStatus.FAILED,
    });
    const store = mockStore(state);

    renderWithBrowserRouter(<RamColumn systemId="abc123" />, {
      route: "/machines",
      store,
    });

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveClass("p-icon--error");
  });
});
