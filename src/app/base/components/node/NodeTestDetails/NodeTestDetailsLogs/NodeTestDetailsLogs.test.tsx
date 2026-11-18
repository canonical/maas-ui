import NodeTestDetailsLogs from "./NodeTestDetailsLogs";

import * as factory from "@/testing/factories";
import { render, screen, userEvent } from "@/testing/utils";

describe("NodeTestDetailsLogs", () => {
  it("displays combined content by default", () => {
    const log = factory.scriptResultData();

    render(<NodeTestDetailsLogs log={log} />);

    expect(screen.getByTestId("log-content")).toHaveTextContent(
      "combined content"
    );
  });

  it("preserves line breaks in the log content", () => {
    const log = factory.scriptResultData({ combined: "first\n  second" });

    render(<NodeTestDetailsLogs log={log} />);

    expect(screen.getByTestId("log-content").textContent).toBe(
      "first\n  second"
    );
  });

  it("displays other content on click", async () => {
    const log = factory.scriptResultData();

    render(<NodeTestDetailsLogs log={log} />);
    await userEvent.click(screen.getByTestId("tab-link-yaml"));

    expect(screen.getByTestId("log-content")).toHaveTextContent("yaml result");
  });

  it("displays 'no data' for empty content", async () => {
    const log = factory.scriptResultData();

    render(<NodeTestDetailsLogs log={log} />);
    await userEvent.click(screen.getByTestId("tab-link-stderr"));

    expect(screen.getByTestId("log-content")).toHaveTextContent("No data");
  });
});
