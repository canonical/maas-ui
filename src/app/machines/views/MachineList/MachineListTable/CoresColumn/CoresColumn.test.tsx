import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";

import { CoresColumn } from "./CoresColumn";

import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();
const state = rootStateFactory({
  machine: machineStateFactory({
    loaded: true,
    items: [
      machineFactory({
        system_id: "abc123",
        architecture: "amd64/generic",
        cpu_count: 4,
        cpu_test_status: testStatusFactory({
          status: 1,
        }),
      }),
    ],
  }),
});

describe("CoresColumn", () => {
  it("renders", () => {
    const store = mockStore(state);
    const { container } = renderWithBrowserRouter(
      <CoresColumn systemId="abc123" />,
      {
        route: "/machines",
        store,
      }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("displays the number of cores", () => {
    state.machine.items[0].cpu_count = 8;
    const store = mockStore(state);
    const { getByTestId } = renderWithBrowserRouter(
      <CoresColumn systemId="abc123" />,
      {
        route: "/machines",
        store,
      }
    );
    expect(getByTestId("cores")).toHaveTextContent("8");
  });

  it("truncates architecture", () => {
    state.machine.items[0].architecture = "i386/generic";
    const store = mockStore(state);
    const { getByTestId } = renderWithBrowserRouter(
      <CoresColumn systemId="abc123" />,
      {
        route: "/machines",
        store,
      }
    );
    expect(getByTestId("arch")).toHaveTextContent("i386");
  });

  it("displays a Tooltip with the full architecture", () => {
    state.machine.items[0].architecture = "amd64/generic";
    const store = mockStore(state);
    const { getByTestId } = renderWithBrowserRouter(
      <CoresColumn systemId="abc123" />,
      {
        route: "/machines",
        store,
      }
    );

    expect(getByTestId("tooltip-content")).toHaveTextContent("amd64/generic");
  });
});
