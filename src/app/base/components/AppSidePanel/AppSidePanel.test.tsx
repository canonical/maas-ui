import AppSidePanel from "./AppSidePanel";

import { MAAS_UI_ID } from "@/app/constants";
import { within, screen, renderWithBrowserRouter } from "@/testing/utils";

it("displays side panel as a child of #maas-ui DOM node", async () => {
  const mainContainer = document.createElement("div");
  mainContainer.setAttribute("id", MAAS_UI_ID);
  renderWithBrowserRouter(<AppSidePanel title="side panel title" />, {
    container: document.body.appendChild(mainContainer),
  });
  expect(
    within(document.getElementById("maas-ui") as HTMLElement).getByText(
      "side panel title"
    )
  ).toBeInTheDocument();
});

it("adds a correct className for a wide panel", async () => {
  renderWithBrowserRouter(<AppSidePanel title="side panel title" />, {
    sidePanelSize: "wide",
  });
  expect(screen.getByRole("complementary").classList.contains("is-wide")).toBe(
    true
  );
});
