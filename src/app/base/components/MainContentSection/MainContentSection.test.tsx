import MainContentSection from "./MainContentSection";

import { renderWithMockStore, screen } from "testing/utils";

describe("MainContentSection", () => {
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

  it("can render a node as a title", () => {
    renderWithMockStore(
      <MainContentSection header={<h5>Node title</h5>}>
        content
      </MainContentSection>
    );
    expect(
      screen.getByRole("heading", {
        name: "Node title",
        level: 5,
      })
    ).toBeInTheDocument();
  });
});
