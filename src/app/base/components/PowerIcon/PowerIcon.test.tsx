/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */
import { render } from "@testing-library/react";

import PowerIcon from "./PowerIcon";

import { PowerState } from "@/app/store/types/enum";

describe("PowerIcon", () => {
  it("renders", () => {
    const { container } = render(<PowerIcon powerState={PowerState.ON} />);
    expect(container.querySelector("i")).toBeInTheDocument();
  });

  it("can show a spinner regardless of the power state", () => {
    const { container } = render(
      <PowerIcon powerState={PowerState.ON} showSpinner />
    );
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-label",
      "loading"
    );
    expect(container.querySelector("i")).not.toBeInTheDocument();
  });

  it("makes the icon inline if children are provided", () => {
    const { container } = render(
      <PowerIcon powerState={PowerState.ON}>On</PowerIcon>
    );
    expect(container.querySelector("i")).toHaveClass("is-inline");
  });
});
