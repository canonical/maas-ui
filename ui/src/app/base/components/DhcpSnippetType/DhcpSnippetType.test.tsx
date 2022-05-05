import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DhcpSnippetType from "./DhcpSnippetType";

import type { RootState } from "app/store/root/types";
import {
  controllerState as controllerStateFactory,
  deviceState as deviceStateFactory,
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  modelRef as modelRefFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    controller: controllerStateFactory({
      loaded: true,
    }),
    device: deviceStateFactory({
      loaded: true,
    }),
    dhcpsnippet: dhcpSnippetStateFactory({
      loaded: true,
      items: [
        dhcpSnippetFactory({ id: 1, name: "class", description: "" }),
        dhcpSnippetFactory({
          id: 2,
          name: "lease",
          subnet: 2,
          description: "",
        }),
        dhcpSnippetFactory({
          id: 3,
          name: "boot",
          node: "xyz",
          description: "",
        }),
      ],
    }),
    machine: machineStateFactory({
      loaded: true,
      items: [
        machineFactory({
          system_id: "xyz",
          hostname: "machine1",
          domain: modelRefFactory({ name: "test" }),
        }),
      ],
    }),
    subnet: subnetStateFactory({
      loaded: true,
      items: [
        subnetFactory({ id: 1, name: "10.0.0.99" }),
        subnetFactory({ id: 2, name: "test.maas" }),
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
      <DhcpSnippetType subnetId={null} nodeId={null} />
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
