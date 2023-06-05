import PageContent from "./PageContent";

import { renderWithBrowserRouter, screen, within } from "testing/utils";

it("displays sidebar with provided content", () => {
  renderWithBrowserRouter(
    <PageContent
      header="Settings"
      sidePanelContent={<div>Sidebar</div>}
      sidePanelTitle={null}
    >
      content
    </PageContent>
  );
  const aside = screen.getByRole("complementary");
  expect(screen.getByRole("complementary")).not.toHaveClass("is-collapsed");
  expect(within(aside).getByText("Sidebar"));
});

it("displays hidden sidebar when no content provided", () => {
  renderWithBrowserRouter(
    <PageContent
      header="Settings"
      sidePanelContent={null}
      sidePanelTitle={null}
    >
      content
    </PageContent>
  );
  expect(screen.queryByRole("complementary")).toHaveClass("is-collapsed");
});
