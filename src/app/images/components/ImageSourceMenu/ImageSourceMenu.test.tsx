import ImageSourceMenu from "./ImageSourceMenu";

import { renderWithProviders, screen, userEvent } from "@/testing/utils";

const mockSources = [
  { id: 1, name: "Primary Source" },
  { id: 2, name: "Secondary Source" },
];

describe("ImageSourceMenu", () => {
  it("renders the current source name as the toggle label", () => {
    renderWithProviders(
      <ImageSourceMenu
        currentSourceId={1}
        onSourceSelect={vi.fn()}
        sources={mockSources}
      />
    );
    expect(
      screen.getByRole("button", { name: /primary source/i })
    ).toBeInTheDocument();
  });

  it("lists all sources as menu items after opening the toggle", async () => {
    renderWithProviders(
      <ImageSourceMenu
        currentSourceId={1}
        onSourceSelect={vi.fn()}
        sources={mockSources}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: /primary source/i })
    );
    expect(
      screen.getByRole("menuitem", { name: /primary source/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /secondary source/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("menuitem", { name: /primary source/i })
    ).toBeAriaDisabled();
  });

  it("calls onSourceSelect with the clicked source when a non-current item is selected", async () => {
    const handleSelect = vi.fn();
    renderWithProviders(
      <ImageSourceMenu
        currentSourceId={1}
        onSourceSelect={handleSelect}
        sources={mockSources}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: /primary source/i })
    );
    await userEvent.click(
      screen.getByRole("menuitem", { name: /secondary source/i })
    );
    expect(handleSelect).toHaveBeenCalledWith(mockSources[1]);
  });
});
