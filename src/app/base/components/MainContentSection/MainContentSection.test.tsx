import MainContentSection from "./MainContentSection";

import { renderWithMockStore, screen, within } from "testing/utils";

it("renders sidebar", () => {
  renderWithMockStore(
    <MainContentSection header="Settings" sidebar={<div>Sidebar</div>}>
      content
    </MainContentSection>
  );
  expect(screen.getByRole("complementary")).toBeInTheDocument();
});

it("renders without a sidebar", () => {
  renderWithMockStore(
    <MainContentSection header="Settings">content</MainContentSection>
  );
  expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
});

it("can render without a header", () => {
  renderWithMockStore(
    <MainContentSection header={null}>content</MainContentSection>
  );

  expect(screen.queryByRole("banner")).not.toBeInTheDocument();
});

it("can render a node as a title", () => {
  renderWithMockStore(
    <MainContentSection header={<h5>Node title</h5>}>
      content
    </MainContentSection>
  );
  expect(
    within(screen.getByRole("banner")).getByRole("heading", { level: 5 })
  ).toHaveTextContent("Node title");
});
