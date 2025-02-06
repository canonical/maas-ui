import EditZone from "./EditZone";

import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  userEvent,
  screen,
  waitFor,
  setupMockServer,
  renderWithProviders,
} from "@/testing/utils";

setupMockServer(
  zoneResolvers.getZone.handler(),
  zoneResolvers.updateZone.handler()
);

describe("EditZone", () => {
  const testZoneId = 1;

  it("runs closeForm function when the cancel button is clicked", async () => {
    const closeForm = vi.fn();
    renderWithProviders(<EditZone closeForm={closeForm} id={testZoneId} />);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls actions.update on save click", async () => {
    renderWithProviders(<EditZone closeForm={vi.fn()} id={testZoneId} />);

    await waitFor(() =>
      expect(screen.getByLabelText("Name")).toBeInTheDocument()
    );

    await userEvent.clear(screen.getByLabelText("Name"));

    await userEvent.clear(screen.getByLabelText("Description"));

    await userEvent.type(
      screen.getByRole("textbox", { name: /name/i }),
      "test name 2"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /description/i }),
      "test description 2"
    );

    await userEvent.click(screen.getByRole("button", { name: /Update AZ/i }));

    await waitFor(() => expect(zoneResolvers.updateZone.resolved).toBeTruthy());
  });
});
