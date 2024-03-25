import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DHCPTable, { TestIds } from "./DHCPTable";

import { Labels as FormLabels } from "@/app/base/components/DhcpForm";
import { MachineMeta } from "@/app/store/machine/types";
import type { RootState } from "@/app/store/root/types";
import { NodeStatus } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { userEvent, render, screen } from "@/testing/utils";

const mockStore = configureStore();

describe("DHCPTable", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      dhcpsnippet: factory.dhcpSnippetState({
        loaded: true,
        loading: false,
        items: [
          factory.dhcpSnippet({ node: "abc123" }),
          factory.dhcpSnippet({ node: "abc123" }),
          factory.dhcpSnippet(),
        ],
      }),
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            architecture: "amd64",
            events: [factory.machineEvent()],
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

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows snippets for a machine", () => {
    state.machine.items = [
      factory.machineDetails({
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
      factory.subnet({ name: "subnet-name1" }),
      factory.subnet({ name: "subnet-name2" }),
    ];
    state.dhcpsnippet.items = [
      factory.dhcpSnippet({ subnet: subnets[0].id }),
      factory.dhcpSnippet(),
      factory.dhcpSnippet({ subnet: subnets[1].id }),
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
      factory.machineDetails({
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
