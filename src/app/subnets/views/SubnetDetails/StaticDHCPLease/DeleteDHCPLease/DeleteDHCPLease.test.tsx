import DeleteDHCPLease from "./DeleteDHCPLease";

import { renderWithBrowserRouter, screen } from "@/testing/utils";

it("renders a delete confirmation form", () => {
  renderWithBrowserRouter(
    <DeleteDHCPLease
      macAddress="91:2a:95:aa:2e:50"
      setSidePanelContent={vi.fn()}
    />
  );
  expect(
    screen.getByRole("form", { name: "Delete static IP" })
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      "Are you sure you want to delete this static IP? This action is permanent and can not be undone."
    )
  ).toBeInTheDocument();
});
