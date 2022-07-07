import { render, screen } from "@testing-library/react";

import ThemedRadioButton from "./ThemedRadioButton";

describe("ThemedRadioButton", () => {
  it("renders", () => {
    render(<ThemedRadioButton label="Test button" name="test-button" />);

    expect(screen.getByRole("radio", { name: "Test button" }));
  });
});
