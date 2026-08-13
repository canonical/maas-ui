import { waitFor } from "@testing-library/react";

import AddSwitch from "./AddSwitch";

import { imageResolvers } from "@/testing/resolvers/images";
import { switchResolvers } from "@/testing/resolvers/switches";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
} from "@/testing/utils";

const mockServer = setupMockServer(
  switchResolvers.createSwitch.handler(),
  imageResolvers.listSelections.handler()
);
const { mockClose } = await mockSidePanel();

describe("AddSwitch", () => {
  it("runs closeForm function when the cancel button is clicked", async () => {
    renderWithProviders(<AddSwitch />);

    await userEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls create switch on save click", async () => {
    renderWithProviders(<AddSwitch />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /MAC address/i }),
      "00:11:22:33:44:55"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /^Name$/i }),
      "test-switch"
    );

    await userEvent.click(screen.getByRole("button", { name: /Save switch/i }));

    await waitFor(() => {
      expect(switchResolvers.createSwitch.resolved).toBeTruthy();
    });
  });

  it("populates the image dropdown with available images", async () => {
    renderWithProviders(<AddSwitch />);

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /centos\/centos7 - 7\.0/i })
      ).toBeInTheDocument();
    });
  });

  it("displays error message when create switch fails", async () => {
    mockServer.use(
      switchResolvers.createSwitch.error({ code: 400, message: "Uh oh!" })
    );

    renderWithProviders(<AddSwitch />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /MAC address/i }),
      "00:11:22:33:44:55"
    );

    await userEvent.click(screen.getByRole("button", { name: /Save switch/i }));

    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });

  it("displays the detailed error message when available", async () => {
    mockServer.use(
      switchResolvers.createSwitch.error({
        code: 422,
        message: "Failed to validate the request.",
        kind: "Error",
        details: [
          {
            type: "InvalidArgumentViolation",
            message: "Boot resource 'ubuntu/noble/s390x' not found.",
            field: "image",
            location: "body",
          },
        ],
      })
    );

    renderWithProviders(<AddSwitch />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /MAC address/i }),
      "00:11:22:33:44:55"
    );

    await userEvent.click(screen.getByRole("button", { name: /Save switch/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Boot resource 'ubuntu\/noble\/s390x' not found\./i)
      ).toBeInTheDocument();
    });
  });
});
