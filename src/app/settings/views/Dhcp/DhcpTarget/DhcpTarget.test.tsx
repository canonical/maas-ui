import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import DhcpTarget from "./DhcpTarget";

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
import { renderWithMockStore } from "testing/utils";

describe("DhcpTarget", () => {
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
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <DhcpTarget subnetId={808} />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("can display a subnet link", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <DhcpTarget subnetId={1} />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    const link = screen.getByRole("link", { name: "10.0.0.99" });

    expect(link).toBeInTheDocument();
    expect(link).toHaveProperty("href", "http://example.com/subnet/1");
  });

  it("can display a node link", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <DhcpTarget nodeId="xyz" />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    const link = screen.getByRole("link", { name: "machine1 .test" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveProperty("href", "http://example.com/machine/xyz");
  });
});
