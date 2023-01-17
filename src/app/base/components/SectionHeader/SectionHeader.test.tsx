import SectionHeader from "./SectionHeader";

import { render, screen } from "testing/utils";

describe("SectionHeader", () => {
  it("can render title and subtitle", () => {
    render(<SectionHeader subtitle="Subtitle" title="Title" />);
    expect(screen.getByTestId("section-header-title")).toHaveTextContent(
      "Title"
    );
    expect(screen.getByTestId("section-header-subtitle")).toHaveTextContent(
      "Subtitle"
    );
  });

  it("displays the title as a h1 by default", () => {
    render(<SectionHeader title="Title" />);
    const title = screen.getByRole("heading", { level: 1, name: "Title" });
    expect(title).toBeInTheDocument();
    expect(title.classList.contains("p-heading--4")).toBe(true);
  });

  it("can change the title element", () => {
    render(<SectionHeader title="Title" titleElement="div" />);
    const title = screen.getByTestId("section-header-title");
    expect(title).toBeInTheDocument();
    expect(title.classList.contains("p-heading--4")).toBe(false);
  });

  it("shows a spinner instead of title if loading", () => {
    render(<SectionHeader loading subtitle="Subtitle" title="Title" />);
    expect(
      screen.getByTestId("section-header-title-spinner")
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("section-header-title")
    ).not.toBeInTheDocument();
  });

  it("shows a spinner instead of subtitle if subtitle loading", () => {
    render(<SectionHeader subtitle="Subtitle" subtitleLoading title="Title" />);
    expect(screen.getByTestId("section-header-subtitle")).toHaveTextContent(
      "Loading"
    );
  });

  it("can render buttons", () => {
    const buttons = [
      <button key="button-1">Button 1</button>,
      <button key="button-2">Button 2</button>,
    ];
    render(<SectionHeader buttons={buttons} title="Title" />);
    expect(screen.getByTestId("section-header-buttons")).toBeInTheDocument();
  });

  it("can render tabs", () => {
    const tabLinks = [
      {
        active: true,
        label: "Tab 1",
        path: "/path1",
      },
      {
        active: false,
        label: "Tab 2",
        path: "/path2",
      },
    ];
    render(<SectionHeader tabLinks={tabLinks} title="Title" />);
    expect(screen.getByTestId("section-header-tabs")).toBeInTheDocument();
  });

  it("can render extra header content as a side panel", () => {
    render(
      <SectionHeader
        sidePanelContent={<div>Header content</div>}
        sidePanelTitle="Header content title"
        title="Title"
      />
    );
    expect(screen.getByTestId("section-header-content")).toBeInTheDocument();
    expect(
      screen.getByRole("complementary", { name: "Header content title" })
    ).toBeInTheDocument();
  });

  it("does not render buttons if header content is present", () => {
    const { rerender } = render(
      <SectionHeader
        buttons={[<button key="button">Click me</button>]}
        subtitle="subtitle"
        title="Title"
      />
    );
    expect(screen.getByTestId("section-header-buttons")).toBeInTheDocument();
    expect(screen.getByTestId("section-header-subtitle")).toBeInTheDocument();

    rerender(
      <SectionHeader
        buttons={[<button key="button">Click me</button>]}
        sidePanelContent={<div>Header content</div>}
        subtitle="subtitle"
        title="Title"
      />
    );
    expect(
      screen.queryByTestId("section-header-buttons")
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("section-header-subtitle")).toBeInTheDocument();
  });
});
