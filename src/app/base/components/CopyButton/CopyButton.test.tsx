import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CopyButton from "./CopyButton";

describe("CopyButton", () => {
  let execCommand: (
    commandId: string,
    showUI?: boolean,
    value?: string
  ) => boolean;

  beforeEach(() => {
    execCommand = document.execCommand;
    document.execCommand = jest.fn();
  });

  afterEach(() => {
    document.execCommand = execCommand;
  });

  it("can copy a value", async () => {
    render(<CopyButton value="Test key" />);

    await userEvent.click(screen.getByRole("button"));

    expect(document.execCommand).toHaveBeenCalled();
  });
});
