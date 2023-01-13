import MainContentSection from "./MainContentSection";

import { renderWithMockStore, screen, within } from "testing/utils";

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
    expect(document.querySelector(".section__content")).not.toHaveClass(
      "col-10"
    );
    expect(document.querySelector(".section__content")).toHaveClass("col-12");
  });

  it("can render a node as a title", () => {
    renderWithMockStore(
      <MainContentSection header={<h5>Node title</h5>}>
        content
      </MainContentSection>
    );
    expect(
      within(screen.getByRole("banner")).getByRole("heading", {
        name: "Node title",
        level: 5,
      })
    ).toBeInTheDocument();
  });
});
