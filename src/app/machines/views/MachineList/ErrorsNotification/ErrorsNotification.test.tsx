import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ErrorsNotification from "./ErrorsNotification";

it("can display and close an error message", async () => {
  render(<ErrorsNotification errors={{ title: "error message" }} />);
  expect(screen.getByText("title: error message")).toBeInTheDocument();
  await userEvent.click(screen.getByLabelText("Close notification"));
  expect(screen.queryByText("title: error message")).not.toBeInTheDocument();
});

it("reopens the notification with a new error when previously dismissed", async () => {
  const { rerender } = render(
    <ErrorsNotification errors={{ title: "error message" }} />
  );
  expect(screen.getByText("title: error message")).toBeInTheDocument();
  await userEvent.click(screen.getByLabelText("Close notification"));
  expect(screen.queryByText("title: error message")).not.toBeInTheDocument();
  rerender(<ErrorsNotification errors={{ title: "another error message" }} />);
  expect(screen.getByText("title: another error message")).toBeInTheDocument();
});
