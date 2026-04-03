import { describe, it, expect } from "vitest";

import Synchronization from "@/app/settings/views/Images/Synchronization/Synchronization";
import { ConfigNames } from "@/app/store/config/types";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
  waitForLoading,
} from "@/testing/utils";

const mockServer = setupMockServer(
  configurationsResolvers.getConfiguration.handler({
    name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
    value: true,
  }),
  configurationsResolvers.setConfiguration.handler()
);

describe("Synchronization", () => {
  it("calls setConfiguration when saving the auto sync switch", async () => {
    renderWithProviders(<Synchronization />);
    await waitForLoading();
    await userEvent.click(
      screen.getByRole("checkbox", { name: /Automatically sync images/i })
    );
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(configurationsResolvers.setConfiguration.resolved).toBe(true);
  });

  it("displays error messages when import fails", async () => {
    mockServer.use(
      configurationsResolvers.getConfiguration.error({
        code: 400,
        message: "Uh oh!",
      })
    );
    renderWithProviders(<Synchronization />);
    await waitForLoading();
    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });

  it("displays error messages when save fails", async () => {
    mockServer.use(
      configurationsResolvers.setConfiguration.error({
        code: 403,
        message: "Uh oh!",
      })
    );
    renderWithProviders(<Synchronization />);
    await waitForLoading();
    await userEvent.click(
      screen.getByRole("checkbox", { name: /Automatically sync images/i })
    );
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });
});
