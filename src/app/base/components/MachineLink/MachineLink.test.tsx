import * as reduxToolkit from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineLink, { Labels } from "./MachineLink";

import urls from "@/app/base/urls";
import * as factory from "@/testing/factories";
import { render, renderWithBrowserRouter, screen } from "@/testing/utils";

const mockStore = configureStore();

vi.mock("@reduxjs/toolkit", async () => {
  const actual: object = await vi.importActual("@reduxjs/toolkit");
  return {
    ...actual,
    nanoid: vi.fn(),
  };
});

it("handles when machines are loading", async () => {
  vi.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
  const state = factory.rootState({
    machine: factory.machineState({
      items: [
        factory.machine({
          system_id: "abc123",
        }),
      ],
      details: {
        123456: factory.machineStateDetailsItem({
          loading: true,
          system_id: "abc123",
        }),
      },
    }),
  });
  renderWithBrowserRouter(<MachineLink systemId="abc123" />, { state });

  expect(screen.getByLabelText(Labels.Loading)).toBeInTheDocument();

  vi.restoreAllMocks();
});

it("handles when a machine does not exist", () => {
  const state = factory.rootState({
    machine: factory.machineState({ items: [], loading: false }),
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
  const machine = factory.machine();
  const state = factory.rootState({
    machine: factory.machineState({ items: [machine], loading: false }),
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
