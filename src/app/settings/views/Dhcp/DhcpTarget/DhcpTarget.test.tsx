import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";

import DhcpTarget from "./DhcpTarget";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithMockStore } from "@/testing/utils";

describe("DhcpTarget", () => {
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
    expect(link).toHaveAttribute("href", "/subnet/1");
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
    expect(link).toHaveAttribute("href", "/machine/xyz");
  });
});
