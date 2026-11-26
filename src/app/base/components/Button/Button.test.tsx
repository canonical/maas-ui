import Button from "./Button";

import { renderWithProviders, screen } from "@/testing/utils";

describe("Button", () => {
  it("renders an ordinary action as a secondary button", () => {
    renderWithProviders(<Button>Save changes</Button>);

    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toHaveClass("ds", "button", "secondary");
    expect(button).not.toHaveClass("primary");
  });

  it("maps Vanilla appearances onto Pragma importance and anticipation", () => {
    const { rerender } = renderWithProviders(
      <Button appearance="base">Cancel</Button>
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveClass(
      "tertiary"
    );

    rerender(<Button appearance="positive">Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass(
      "primary",
      "constructive"
    );

    rerender(<Button appearance="negative">Delete</Button>);
    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass(
      "primary",
      "destructive"
    );

    rerender(<Button appearance="link">Details</Button>);
    expect(screen.getByRole("button", { name: "Details" })).toHaveClass("link");

    rerender(<Button appearance="neutral">Filter</Button>);
    expect(screen.getByRole("button", { name: "Filter" })).toHaveClass(
      "secondary"
    );
  });

  it("keeps icon children and does not forward Vanilla-only props", () => {
    renderWithProviders(
      <Button dense hasIcon small type="button">
        <i className="p-icon--edit">Edit</i>
      </Button>
    );

    const button = screen.getByRole("button", { name: "Edit" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).not.toHaveAttribute("dense");
    expect(button).not.toHaveAttribute("hasIcon");
    expect(button.querySelector("i")).toHaveClass("p-icon--edit");
  });

  it("disables the button", () => {
    renderWithProviders(<Button disabled>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });
});
