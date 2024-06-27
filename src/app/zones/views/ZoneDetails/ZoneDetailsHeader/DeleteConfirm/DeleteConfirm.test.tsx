import DeleteConfirm from "./DeleteConfirm";

import * as factory from "@/testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "@/testing/utils";

describe("DeleteConfirm", () => {
  const queryData = {
    zones: [
      factory.zone({
        id: 1,
        name: "zone-name",
      }),
    ],
  };

  it("runs onConfirm function when Delete AZ is clicked", async () => {
    const closeExpanded = vi.fn();
    const onConfirm = vi.fn();
    renderWithBrowserRouter(
      <DeleteConfirm
        closeExpanded={closeExpanded}
        confirmLabel="Delete AZ"
        deleting={false}
        onConfirm={onConfirm}
      />,
      { route: "/zones", queryData }
    );

    await userEvent.click(screen.getByRole("button", { name: "Delete AZ" }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("runs closeExpanded function when cancel is clicked", async () => {
    const closeExpanded = vi.fn();
    const onConfirm = vi.fn();
    renderWithBrowserRouter(
      <DeleteConfirm
        closeExpanded={closeExpanded}
        confirmLabel="Delete AZ"
        deleting={false}
        onConfirm={onConfirm}
      />,
      { route: "/zones", queryData }
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeExpanded).toHaveBeenCalled();
  });
});
