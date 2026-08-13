import DeleteSwitch from "./DeleteSwitch";

import { switchResolvers } from "@/testing/resolvers/switches";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
  waitForLoading,
} from "@/testing/utils";

const mockServer = setupMockServer(
  switchResolvers.getSwitch.handler(),
  switchResolvers.deleteSwitch.handler()
);
const { mockClose } = await mockSidePanel();

describe("DeleteSwitch", () => {
  it("calls closeForm on cancel click", async () => {
    renderWithProviders(<DeleteSwitch id={2} />);
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls delete switch on save click", async () => {
    renderWithProviders(<DeleteSwitch id={2} />);
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: /Delete/i }));
    await waitFor(() => {
      expect(switchResolvers.deleteSwitch.resolved).toBeTruthy();
    });
  });

  it("displays error messages when delete switch fails", async () => {
    mockServer.use(
      switchResolvers.deleteSwitch.error({ code: 400, message: "Uh oh!" })
    );
    renderWithProviders(<DeleteSwitch id={2} />);
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });

  it("displays the detailed error message when available", async () => {
    mockServer.use(
      switchResolvers.deleteSwitch.error({
        code: 422,
        message: "Failed to validate the request.",
        kind: "Error",
        details: [
          {
            type: "InvalidArgumentViolation",
            message: "Switch is still in use.",
            field: "switch_id",
            location: "path",
          },
        ],
      })
    );
    renderWithProviders(<DeleteSwitch id={2} />);
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(screen.getByText(/Switch is still in use\./i)).toBeInTheDocument();
    });
  });
});
