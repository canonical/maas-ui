import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DHCPTable, { Labels, TestIds } from "./DHCPTable";

import { Labels as FormLabels } from "app/base/components/DhcpForm";
import { MachineMeta } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeStatus } from "app/store/types/node";
import {
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
  machineDetails as machineDetailsFactory,
  machineEvent as machineEventFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DHCPTable", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        loaded: true,
        loading: false,
        items: [
          dhcpSnippetFactory({ node: "abc123" }),
          dhcpSnippetFactory({ node: "abc123" }),
          dhcpSnippetFactory(),
        ],
      }),
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            architecture: "amd64",
            events: [machineEventFactory()],
            system_id: "abc123",
          }),
        ],
        loaded: true,
        loading: false,
      }),
    });
  });

  it("shows loading state for snippets", () => {
    state.dhcpsnippet.loading = true;
    state.dhcpsnippet.loaded = false;
    state.dhcpsnippet.items = [];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <DHCPTable
              modelName={MachineMeta.MODEL}
              node={state.machine.items[0]}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("alert", { name: Labels.LoadingData })
    ).toBeInTheDocument();
  });

  it("shows snippets for a machine", () => {
    state.machine.items = [
      machineDetailsFactory({
        on_network: true,
        osystem: "ubuntu",
        status: NodeStatus.NEW,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <DHCPTable
              modelName={MachineMeta.MODEL}
              node={state.machine.items[0]}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByRole("row").length).toBe(3);
  });

  it("shows snippets for subnets", () => {
    const subnets = [
      subnetFactory({ name: "subnet-name1" }),
      subnetFactory({ name: "subnet-name2" }),
    ];
    state.dhcpsnippet.items = [
      dhcpSnippetFactory({ subnet: subnets[0].id }),
      dhcpSnippetFactory(),
      dhcpSnippetFactory({ subnet: subnets[1].id }),
    ];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <DHCPTable modelName={MachineMeta.MODEL} subnets={subnets} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const subnetSnippets = screen.getAllByTestId(TestIds.AppliesTo);

    expect(subnetSnippets.length).toBe(2);
    expect(subnetSnippets[0].textContent).toBe("subnet-name1");
    expect(subnetSnippets[1].textContent).toBe("subnet-name2");
  });

  it("can show a form to edit a snippet", async () => {
    state.controller.loaded = true;
    state.device.loaded = true;
    state.machine.loaded = true;
    state.machine.items = [
      machineDetailsFactory({
        on_network: true,
        osystem: "ubuntu",
        status: NodeStatus.NEW,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <DHCPTable
              modelName={MachineMeta.MODEL}
              node={state.machine.items[0]}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const buttons = screen.getAllByRole("button", { name: "Edit" });

    await userEvent.click(buttons[buttons.length - 1]);

    expect(
      screen.getByRole("form", { name: FormLabels.Form })
    ).toBeInTheDocument();
  });
});
