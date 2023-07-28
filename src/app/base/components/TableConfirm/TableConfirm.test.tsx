import userEvent from "@testing-library/user-event";

import TableConfirm from "./TableConfirm";

import { render, screen } from "testing/utils";

describe("TableConfirm", () => {
  it("renders", () => {
    render(
      <TableConfirm
        confirmLabel="Yes I am"
        finished={false}
        inProgress={false}
        message="...ARE YOU SURE ABOUT THAT?"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    expect(screen.getByText("...ARE YOU SURE ABOUT THAT?")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Yes I am" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("can confirm", async () => {
    const onConfirm = jest.fn();
    render(
      <TableConfirm
        confirmLabel="save"
        finished={false}
        inProgress={false}
        message="Are you sure"
        onClose={jest.fn()}
        onConfirm={onConfirm}
      />
    );
    const confirmButton = screen.getByText(/save/i);
    await userEvent.click(confirmButton);
    expect(onConfirm).toHaveBeenCalled();
  });

  it("can cancel", async () => {
    const onClose = jest.fn();
    render(
      <TableConfirm
        confirmLabel="save"
        finished={false}
        inProgress={false}
        message="Are you sure"
        onClose={onClose}
        onConfirm={jest.fn()}
      />
    );
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });

  it("closes when it has finished", async () => {
    const onClose = jest.fn();
    const { rerender } = render(
      <TableConfirm
        confirmLabel="save"
        finished={false}
        inProgress={false}
        message="Are you sure"
        onClose={onClose}
        onConfirm={jest.fn()}
      />
    );
    const confirmButton = screen.getByText(/save/i);
    await userEvent.click(confirmButton);
    expect(onClose).not.toHaveBeenCalled();
    rerender(
      <TableConfirm
        confirmLabel="save"
        finished={true}
        inProgress={false}
        message="Are you sure"
        onClose={onClose}
        onConfirm={jest.fn()}
      />
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("runs onSuccess function when it has finished", async () => {
    const onSuccess = jest.fn();
    const { rerender } = render(
      <TableConfirm
        confirmLabel="save"
        finished={false}
        inProgress={false}
        message="Are you sure"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        onSuccess={onSuccess}
      />
    );
    const confirmButton = screen.getByText(/save/i);
    await userEvent.click(confirmButton);
    expect(onSuccess).not.toHaveBeenCalled();
    rerender(
      <TableConfirm
        confirmLabel="save"
        finished={true}
        inProgress={false}
        message="Are you sure"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        onSuccess={onSuccess}
      />
    );
    expect(onSuccess).toHaveBeenCalled();
  });

  it("can display an error", () => {
    const onClose = jest.fn();
    render(
      <TableConfirm
        confirmLabel="save"
        errors="It didn't work"
        finished={false}
        inProgress={false}
        message="Are you sure"
        onClose={onClose}
        onConfirm={jest.fn()}
      />
    );
    expect(screen.getByText("It didn't work")).toBeInTheDocument();
  });

  it("can display an error for a field", () => {
    const onClose = jest.fn();
    render(
      <TableConfirm
        confirmLabel="save"
        errorKey="delete"
        errors={{ delete: ["It didn't work"] }}
        finished={false}
        inProgress={false}
        message="Are you sure"
        onClose={onClose}
        onConfirm={jest.fn()}
      />
    );
    expect(screen.getByText("It didn't work")).toBeInTheDocument();
  });
});
