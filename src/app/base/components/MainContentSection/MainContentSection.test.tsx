import MainContentSection from "./MainContentSection";

import { renderWithMockStore, screen } from "testing/utils";

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

  // ContentSection.Header doesn't have an accessible role, and also
  // does not accept aria labels or test ids in its props.
  expect(document.querySelector(".content-section__header")).toBeNull();
});

it("can render a node as a title", () => {
  renderWithMockStore(
    <MainContentSection header={<h5>Node title</h5>}>
      content
    </MainContentSection>
  );
  expect(screen.getByRole("heading", { level: 5 })).toHaveTextContent(
    "Node title"
  );
});
