import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineLink from "./MachineLink";

import machineURLs from "app/machines/urls";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("handles when machines are loading", () => {
  const state = rootStateFactory({
    machine: machineStateFactory({ items: [], loading: true }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <MachineLink systemId="abc123" />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByLabelText("Loading machines")).toBeInTheDocument();
});

it("handles when a machine does not exist", () => {
  const state = rootStateFactory({
    machine: machineStateFactory({ items: [], loading: false }),
  });
  const store = mockStore(state);
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter>
        <MachineLink systemId="abc123" />
      </MemoryRouter>
    </Provider>
  );

  expect(container).toBeEmptyDOMElement();
});

it("renders a link if machines have loaded and it exists", () => {
  const machine = machineFactory();
  const state = rootStateFactory({
    machine: machineStateFactory({ items: [machine], loading: false }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <MachineLink systemId={machine.system_id} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    machineURLs.machine.index({ id: machine.system_id })
  );
});
