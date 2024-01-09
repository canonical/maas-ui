import ModelDeleteForm from "./ModelDeleteForm";

import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

it("renders", () => {
  renderWithBrowserRouter(
    <ModelDeleteForm
      initialValues={{}}
      modelType="machine"
      onSubmit={jest.fn()}
      submitLabel="Delete"
    />
  );
  expect(
    screen.getByText("Are you sure you want to delete this machine?")
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
});

it("can confirm", async () => {
  const onSubmit = jest.fn();
  renderWithBrowserRouter(
    <ModelDeleteForm
      initialValues={{}}
      modelType="machine"
      onSubmit={onSubmit}
      submitLabel="Delete"
    />
  );
  const submitBtn = screen.getByRole("button", { name: /delete/i });
  await userEvent.click(submitBtn);
  expect(onSubmit).toHaveBeenCalled();
});

it("can cancel", async () => {
  const onCancel = jest.fn();
  renderWithBrowserRouter(
    <ModelDeleteForm
      cancelLabel="Cancel"
      initialValues={{}}
      modelType="machine"
      onCancel={onCancel}
      onSubmit={jest.fn()}
    />
  );
  const cancelBtn = screen.getByRole("button", { name: /cancel/i });
  await userEvent.click(cancelBtn);
  expect(onCancel).toHaveBeenCalled();
});
