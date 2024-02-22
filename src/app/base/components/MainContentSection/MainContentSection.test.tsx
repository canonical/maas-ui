import MainContentSection from "./MainContentSection";

import { renderWithMockStore, screen, within } from "@/testing/utils";

it("renders", () => {
  renderWithMockStore(
    <MainContentSection header="Settings">content</MainContentSection>
  );
  expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
});

it("can render without a header", () => {
  renderWithMockStore(
    <MainContentSection header={null}>content</MainContentSection>
  );
  expect(
    screen.queryByRole("banner", { name: "main content" })
  ).not.toBeInTheDocument();
});

it("can render a node as a title", () => {
  renderWithMockStore(
    <MainContentSection header={<h5>Node title</h5>}>
      content
    </MainContentSection>
  );
  expect(
    within(screen.getByRole("banner", { name: "main content" })).getByRole(
      "heading",
      {
        name: "Node title",
        level: 5,
      }
    )
  ).toBeInTheDocument();
});
