import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TableConfirm from "./TableConfirm";

import { renderWithBrowserRouter } from "testing/utils";

describe("TableConfirm", () => {
  it("renders", () => {
    const { container } = render(
      <TableConfirm
        confirmLabel="save"
        finished={false}
        inProgress={false}
        message="Are you sure"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("can confirm", () => {
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
    userEvent.click(confirmButton);
    expect(onConfirm).toHaveBeenCalled();
  });

  it("can cancel", () => {
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
    userEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });

  it("closes when it has finished", () => {
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
    const confirmButton = screen.getByText(/save/i);
    userEvent.click(confirmButton);
    expect(onClose).not.toHaveBeenCalled();
    act(() => {
      render(
        <TableConfirm
          confirmLabel="save"
          finished={true}
          inProgress={false}
          message="Are you sure"
          onClose={onClose}
          onConfirm={jest.fn()}
        />
      );
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("runs onSuccess function when it has finished", () => {
    const onSuccess = jest.fn();
    render(
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
    userEvent.click(confirmButton);
    expect(onSuccess).not.toHaveBeenCalled();
    act(() => {
      render(
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
    });
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
    expect(screen.getByText(/Error:/i)).toHaveTextContent("It didn't work");
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
    expect(screen.getByText(/Error:/i)).toHaveTextContent("It didn't work");
  });
});
