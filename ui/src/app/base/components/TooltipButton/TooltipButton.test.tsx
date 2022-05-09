import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TooltipButton from "./TooltipButton";

import { breakLines, unindentString } from "app/utils";

it("renders with default options correctly", () => {
  render(<TooltipButton data-testid="tooltip-portal" message="Tooltip" />);
  const button = screen.getByRole("button");

  userEvent.click(button);

  expect(screen.getByTestId("tooltip-portal")).toMatchSnapshot();
  expect(button).toMatchSnapshot();
});

it("can override default props", () => {
  render(
    <TooltipButton
      buttonProps={{ appearance: "negative", className: "button-class" }}
      data-testid="tooltip-portal"
      iconName="warning"
      iconProps={{ className: "icon-class" }}
      message="Tooltip"
      tooltipClassName="tooltip-class"
    />
  );
  const button = screen.getByRole("button");

  userEvent.click(button);

  expect(screen.getByTestId("tooltip-portal")).toMatchSnapshot();
  expect(button).toMatchSnapshot();
});

it("automatically unindents and breaks string messages into lines", () => {
  const message = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
  a malesuada leo. Cras imperdiet maximus velit vel euismod. Fusce laoreet sem
  at pellentesque ultricies. Proin posuere tortor at sollicitudin tempus.`;
  render(<TooltipButton message={message} />);
  const button = screen.getByRole("button");

  userEvent.click(button);

  expect(screen.getByRole("tooltip").textContent).toBe(
    breakLines(unindentString(message))
  );
});
