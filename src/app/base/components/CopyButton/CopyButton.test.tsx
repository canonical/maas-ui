import CopyButton from "./CopyButton";

import { userEvent, render, screen } from "testing/utils";

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
