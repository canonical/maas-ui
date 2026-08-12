import { waitFor } from "@testing-library/react";

import EditSwitch from "./EditSwitch";

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
  switchResolvers.getSwitch.handler(),
  switchResolvers.updateSwitch.handler(),
  imageResolvers.listSelections.handler()
);
const { mockClose } = await mockSidePanel();

describe("EditSwitch", () => {
  const testSwitchId = 1;

  it("runs closeForm function when the cancel button is clicked", async () => {
    renderWithProviders(<EditSwitch id={testSwitchId} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls update switch on save click", async () => {
    renderWithProviders(<EditSwitch id={testSwitchId} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });

    await userEvent.clear(screen.getByLabelText("Name"));
    await userEvent.type(screen.getByLabelText("Name"), "updated-switch");

    await userEvent.click(screen.getByRole("button", { name: /Save switch/i }));

    await waitFor(() => {
      expect(switchResolvers.updateSwitch.resolved).toBeTruthy();
    });
  });

  it("displays error message when update switch fails", async () => {
    mockServer.use(
      switchResolvers.updateSwitch.error({ code: 400, message: "Uh oh!" })
    );

    renderWithProviders(<EditSwitch id={testSwitchId} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText("Name"), "test");

    await userEvent.click(screen.getByRole("button", { name: /Save switch/i }));

    await waitFor(() => {
      expect(screen.getByText("Uh oh!")).toBeInTheDocument();
    });
  });

  it("displays the detailed error message when available", async () => {
    mockServer.use(
      switchResolvers.updateSwitch.error({
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

    renderWithProviders(<EditSwitch id={testSwitchId} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText("Name"), "test");

    await userEvent.click(screen.getByRole("button", { name: /Save switch/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Boot resource 'ubuntu\/noble\/s390x' not found\./i)
      ).toBeInTheDocument();
    });
  });
});
