import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import OutsideClickHandler from "./OutsideClickHandler";

it("calls the onClick handler when clicking outside of the component", async () => {
  const onClick = jest.fn();
  render(
    <div>
      <div>Outside</div>
      <OutsideClickHandler onClick={onClick}>
        <div>Inside</div>
      </OutsideClickHandler>
    </div>
  );
  await userEvent.click(screen.getByText("Inside"));
  expect(onClick).not.toHaveBeenCalled();
  await userEvent.click(screen.getByText("Outside"));
  expect(onClick).toHaveBeenCalled();
});
