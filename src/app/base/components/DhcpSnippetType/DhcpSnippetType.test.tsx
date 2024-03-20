import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DhcpSnippetType from "./DhcpSnippetType";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = factory.rootState({
    controller: factory.controllerState({
      loaded: true,
    }),
    device: factory.deviceState({
      loaded: true,
    }),
    dhcpsnippet: factory.dhcpSnippetState({
      loaded: true,
      items: [
        factory.dhcpSnippet({ id: 1, name: "class", description: "" }),
        factory.dhcpSnippet({
          id: 2,
          name: "lease",
          subnet: 2,
          description: "",
        }),
        factory.dhcpSnippet({
          id: 3,
          name: "boot",
          node: "xyz",
          description: "",
        }),
      ],
    }),
    machine: factory.machineState({
      loaded: true,
      items: [
        factory.machine({
          system_id: "xyz",
          hostname: "machine1",
          domain: factory.modelRef({ name: "test" }),
        }),
      ],
    }),
    subnet: factory.subnetState({
      loaded: true,
      items: [
        factory.subnet({ id: 1, name: "10.0.0.99" }),
        factory.subnet({ id: 2, name: "test.maas" }),
      ],
    }),
  });
});

it("displays a loading component if loading", () => {
  state.controller.loading = true;
  state.device.loading = true;
  state.dhcpsnippet.loading = true;
  state.machine.loading = true;
  state.subnet.loading = true;
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <DhcpSnippetType subnetId={808} />
    </Provider>
  );
  expect(screen.getByText("Loading")).toBeInTheDocument();
});

it("displays a global type", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <DhcpSnippetType nodeId={null} subnetId={null} />
    </Provider>
  );
  expect(screen.getByText("Global")).toBeInTheDocument();
});

it("can display a Machine type", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <DhcpSnippetType nodeId="xyz" />
    </Provider>
  );
  expect(screen.getByText("Machine")).toBeInTheDocument();
});
