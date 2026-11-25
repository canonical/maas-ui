import CodeBlock from "./CodeBlock";

import { renderWithProviders, screen, within } from "@/testing/utils";

describe("CodeBlock", () => {
  it("renders the code in a block", () => {
    renderWithProviders(<CodeBlock>sudo maas createadmin</CodeBlock>);

    expect(screen.getByText("sudo maas createadmin")).toBeInTheDocument();
  });

  it("adds the linux prompt class", () => {
    renderWithProviders(
      <CodeBlock appearance="linux-prompt" data-testid="snippet">
        echo hi
      </CodeBlock>
    );

    expect(screen.getByTestId("snippet")).toHaveClass(
      "p-code-block--linux-prompt"
    );
  });

  it("renders each line for numbered output", () => {
    renderWithProviders(
      <CodeBlock
        appearance="numbered"
        aria-label="Installation output"
        role="region"
      >
        {"one\ntwo"}
      </CodeBlock>
    );

    const region = screen.getByRole("region", { name: "Installation output" });
    expect(within(region).getByText("one")).toHaveClass("p-code-block__line");
    expect(within(region).getByText("two")).toHaveClass("p-code-block__line");
  });

  it("shows a copy button outside the code when copyable", () => {
    renderWithProviders(<CodeBlock copyable>sudo maas createadmin</CodeBlock>);

    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    expect(
      within(screen.getByText("sudo maas createadmin")).queryByRole("button")
    ).not.toBeInTheDocument();
  });
});
