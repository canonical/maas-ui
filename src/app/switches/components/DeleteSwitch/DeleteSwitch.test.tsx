import DeleteSwitch from "./DeleteSwitch";

import { switchResolvers } from "@/testing/resolvers/switches";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(switchResolvers.deleteSwitch.handler());
const { mockClose } = await mockSidePanel();

describe("DeleteSwitch", () => {
  const testSwitchId = 1;

  it("closes the side panel when cancel is clicked", async () => {
    renderWithProviders(<DeleteSwitch id={testSwitchId} />);

    await userEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(mockClose).toHaveBeenCalled();
  });

  it("calls delete switch on confirm click", async () => {
    renderWithProviders(<DeleteSwitch id={testSwitchId} />);

    await userEvent.click(
      screen.getByRole("button", { name: /Delete switch/i })
    );

    await waitFor(() => {
      expect(switchResolvers.deleteSwitch.resolved).toBeTruthy();
    });
  });

  it("displays error message when delete switch fails", async () => {
    mockServer.use(
      switchResolvers.deleteSwitch.error({
        code: 404,
        message: "Switch not found.",
      })
    );

    renderWithProviders(<DeleteSwitch id={testSwitchId} />);

    await userEvent.click(
      screen.getByRole("button", { name: /Delete switch/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/Switch not found./i)).toBeInTheDocument();
    });
  });
});
