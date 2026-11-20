import { vi } from "vitest";

import GuidedProvisioning from "./GuidedProvisioning";

import { rackResolvers } from "@/testing/resolvers/racks";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  within,
} from "@/testing/utils";

setupMockServer(rackResolvers.generateToken.handler());
const { mockClose } = await mockSidePanel();

describe("GuidedProvisioning", () => {
  const testRackId = 1;

  it("uses the only supported version in the install command", () => {
    renderWithProviders(<GuidedProvisioning id={testRackId} />);
    const versionSelect = screen.getByRole("combobox", { name: "Version" });

    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: "v3.7 Snap" })).toHaveValue(
      "3.7"
    );
    expect(versionSelect).toHaveValue("3.7");
    expect(screen.getByTestId("first-command-snippet")).toHaveTextContent(
      "sudo snap install maas-agent --channel=3.7"
    );
    expect(screen.getByTestId("second-command-snippet")).toHaveTextContent(
      "maas-agent init --token <TOKEN>"
    );
  });

  it("displays the generated token for copying without changing either command", async () => {
    renderWithProviders(<GuidedProvisioning id={testRackId} />);

    await userEvent.click(
      screen.getByRole("button", { name: /Generate token/i })
    );

    const token = await screen.findByText("generated-token");
    const copy = vi.fn((command: string) => {
      expect(command).toBe("copy");
      expect(document.activeElement).toHaveValue("generated-token");
      return true;
    });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: copy,
    });

    try {
      expect(rackResolvers.generateToken.resolved).toBeTruthy();
      expect(
        screen.queryByRole("button", { name: /Generate token/i })
      ).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole("button", { name: "Copy" }));
      expect(copy).toHaveBeenCalledWith("copy");
      expect(within(token).queryByRole("button")).not.toBeInTheDocument();
    } finally {
      Reflect.deleteProperty(document, "execCommand");
    }
    expect(screen.getByTestId("first-command-snippet")).toHaveTextContent(
      "sudo snap install maas-agent --channel=3.7"
    );
    expect(screen.getByTestId("second-command-snippet")).toHaveTextContent(
      "maas-agent init --token <TOKEN>"
    );
  });

  it("can close the instructions", async () => {
    renderWithProviders(<GuidedProvisioning id={testRackId} />);

    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(mockClose).toHaveBeenCalled();
  });
});
