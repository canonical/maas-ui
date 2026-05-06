import EditSwitch from "./EditSwitch";

import { imageResolvers } from "@/testing/resolvers/images";
import { switchResolvers } from "@/testing/resolvers/switches";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  switchResolvers.getSwitch.handler(),
  switchResolvers.updateSwitch.handler(),
  imageResolvers.listAvailableSelections.handler()
);
const { mockClose } = await mockSidePanel();

describe("EditSwitch", () => {
  const testSwitchId = 1;

  it("closes the side panel when cancel is clicked", async () => {
    renderWithProviders(<EditSwitch id={testSwitchId} />);

    await userEvent.click(
      await screen.findByRole("button", { name: /Cancel/i })
    );

    expect(mockClose).toHaveBeenCalled();
  });

  it("calls update switch on save with image", async () => {
    renderWithProviders(<EditSwitch id={testSwitchId} />);

    await userEvent.selectOptions(
      await screen.findByRole("combobox", { name: /image/i }),
      "ubuntu/noble"
    );

    await userEvent.click(screen.getByRole("button", { name: /Save switch/i }));

    await waitFor(() => {
      expect(switchResolvers.updateSwitch.resolved).toBeTruthy();
    });
  });

  it("displays error message when update switch fails", async () => {
    mockServer.use(
      switchResolvers.updateSwitch.error({
        code: 500,
        message: "Internal server error",
      })
    );

    renderWithProviders(<EditSwitch id={testSwitchId} />);

    await userEvent.selectOptions(
      await screen.findByRole("combobox", { name: /image/i }),
      "ubuntu/noble"
    );

    await userEvent.click(screen.getByRole("button", { name: /Save switch/i }));

    await waitFor(() => {
      expect(screen.getByText(/Internal server error/i)).toBeInTheDocument();
    });
  });
});
