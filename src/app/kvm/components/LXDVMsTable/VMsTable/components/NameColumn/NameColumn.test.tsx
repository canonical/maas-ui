import NameColumn from "./NameColumn";

import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

describe("NameColumn", () => {
  it("shows a spinner if the machine is still loading", () => {
    const state = factory.rootState({
      machine: factory.machineState({
        items: [],
      }),
    });
    renderWithBrowserRouter(<NameColumn systemId="abc123" />, {
      state,
      route: "/kvm/1/project",
    });

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("shows a link to the VM's details page", () => {
    const state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machine({ hostname: "test-machine-1", system_id: "abc123" }),
        ],
      }),
    });
    renderWithBrowserRouter(<NameColumn systemId="abc123" />, {
      state,
      route: "/kvm/1/project",
    });

    expect(
      screen.getByRole("link", { name: /test-machine-1/i })
    ).toHaveAttribute("href", "/machine/abc123");
  });
});
