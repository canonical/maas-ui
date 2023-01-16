import reduxToolkit from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MachineLink, { Labels } from "./MachineLink";

import urls from "app/base/urls";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  machineStateDetailsItem as machineStateDetailsItemFactory,
} from "testing/factories";
import { render, screen, waitFor } from "testing/utils";

const mockStore = configureStore();

it("handles when machines are loading", async () => {
  jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [
        machineFactory({
          system_id: "abc123",
        }),
      ],
      details: {
        123456: machineStateDetailsItemFactory({
          loading: true,
          system_id: "abc123",
        }),
      },
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <MachineLink systemId="abc123" />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await waitFor(() =>
    expect(screen.getByLabelText(Labels.Loading)).toBeInTheDocument()
  );
  jest.restoreAllMocks();
});

it("handles when a machine does not exist", () => {
  const state = rootStateFactory({
    machine: machineStateFactory({ items: [], loading: false }),
  });
  const store = mockStore(state);
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <MachineLink systemId="abc123" />
        </CompatRouter>
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
        <CompatRouter>
          <MachineLink systemId={machine.system_id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    urls.machines.machine.index({ id: machine.system_id })
  );
});
