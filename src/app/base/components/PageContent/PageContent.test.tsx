import PageContent from "@/app/base/components/PageContent/PageContent";
import { renderWithProviders, screen, within } from "@/testing/utils";

describe("PageContent", () => {
  it("can render without a header", () => {
    renderWithProviders(<PageContent header={null}>content</PageContent>);
    expect(
      screen.queryByRole("banner", { name: "main content" })
    ).not.toBeInTheDocument();
  });

  it("can render a node as a title", () => {
    renderWithProviders(
      <PageContent header={<h5>Node title</h5>}>content</PageContent>
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
});
