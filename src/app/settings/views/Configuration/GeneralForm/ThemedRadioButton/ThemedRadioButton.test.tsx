import ThemedRadioButton from "./ThemedRadioButton";

import { render, screen } from "testing/utils";

describe("ThemedRadioButton", () => {
  it("displays a radio button", () => {
    render(<ThemedRadioButton label="Test button" name="test-button" />);

    expect(screen.getByRole("radio", { name: "Test button" }));
  });
});
