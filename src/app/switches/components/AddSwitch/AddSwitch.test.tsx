import AddSwitch from "./AddSwitch";

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
  switchResolvers.createSwitch.handler(),
  imageResolvers.listAvailableSelections.handler()
);
const { mockClose } = await mockSidePanel();

describe("AddSwitch", () => {
  it("closes the side panel when cancel is clicked", async () => {
    renderWithProviders(<AddSwitch />);

    await userEvent.click(
      await screen.findByRole("button", { name: /Cancel/i })
    );

    expect(mockClose).toHaveBeenCalled();
  });

  it("calls create switch on save with mac address and image", async () => {
    renderWithProviders(<AddSwitch />);

    await userEvent.type(
      await screen.findByRole("textbox", { name: /mac address/i }),
      "aa:bb:cc:dd:ee:ff"
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /image/i }),
      "ubuntu/noble"
    );

    await userEvent.click(screen.getByRole("button", { name: /Save switch/i }));

    await waitFor(() => {
      expect(switchResolvers.createSwitch.resolved).toBeTruthy();
    });
  });

  it("displays an error when create switch fails", async () => {
    mockServer.use(
      switchResolvers.createSwitch.error({
        code: 409,
        message: "A switch with this MAC address already exists.",
      })
    );
    renderWithProviders(<AddSwitch />);

    await userEvent.type(
      await screen.findByRole("textbox", { name: /mac address/i }),
      "aa:bb:cc:dd:ee:ff"
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /image/i }),
      "ubuntu/noble"
    );

    await userEvent.click(screen.getByRole("button", { name: /Save switch/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/A switch with this MAC address already exists./i)
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid MAC address", async () => {
    renderWithProviders(<AddSwitch />);

    await userEvent.type(
      await screen.findByRole("textbox", { name: /mac address/i }),
      "not-a-mac"
    );
    await userEvent.click(screen.getByRole("button", { name: /Save switch/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid MAC address/i)).toBeInTheDocument();
    });
  });
});
