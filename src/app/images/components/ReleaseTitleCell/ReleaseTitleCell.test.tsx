import ReleaseTitleCell from "./ReleaseTitleCell";

import { renderWithProviders, screen } from "@/testing/utils";

describe("ReleaseTitleCell", () => {
  it("renders the title and release", () => {
    renderWithProviders(<ReleaseTitleCell release="noble" title="24.04 LTS" />);
    expect(screen.getByText("24.04 LTS")).toBeInTheDocument();
    expect(screen.getByText("noble")).toBeInTheDocument();
  });

  it("does not render a separate muted release element when title and release are identical", () => {
    renderWithProviders(<ReleaseTitleCell release="noble" title="noble" />);
    expect(screen.getAllByText("noble")).toHaveLength(1);
  });
});
