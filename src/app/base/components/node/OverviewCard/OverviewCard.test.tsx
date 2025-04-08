import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import OverviewCard from "./OverviewCard";

import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

it("renders a controller status section if node is a controller", () => {
  const controller = factory.controllerDetails();
  const state = factory.rootState({
    controller: factory.controllerState({
      items: [controller],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <OverviewCard node={controller} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("controller-status")).toBeInTheDocument();
  expect(screen.queryByTestId("machine-status")).not.toBeInTheDocument();
});

it("renders a machine status section if node is a machine", () => {
  const machine = factory.machineDetails();
  const state = factory.rootState({
    machine: factory.machineState({
      items: [machine],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <OverviewCard node={machine} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("machine-status")).toBeInTheDocument();
  expect(screen.queryByTestId("controller-status")).not.toBeInTheDocument();
});
