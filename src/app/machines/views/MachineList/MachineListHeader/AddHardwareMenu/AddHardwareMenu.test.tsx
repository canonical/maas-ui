import AddHardwareMenu from "./AddHardwareMenu";

import { screen, render } from "@/testing/utils";

describe("AddHardwareMenu", () => {
  it("can be enabled", () => {
    render(<AddHardwareMenu />);
    expect(screen.getByRole("button", { name: /Add hardware/i })).toBeEnabled();
  });
  it("can be disabled", () => {
    render(<AddHardwareMenu disabled />);
    expect(
      screen.getByRole("button", { name: /Add hardware/i })
    ).toBeAriaDisabled();
  });
});
