import { render } from "@testing-library/react";

import StoragePopover from "./StoragePopover";

import { podStoragePoolResource as podStoragePoolResourceFactory } from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

describe("StoragePopover", () => {
  const pools = {
    poolio: podStoragePoolResourceFactory({
      allocated_other: 2000,
      allocated_tracked: 5000,
      backend: "zfs",
      path: "/path",
      total: 15000,
    }),
  };

  it("correctly displays storage data", () => {
    render(<StoragePopover pools={pools}>Child</StoragePopover>);
    userEvent.tab();
    expect(screen.getByTestId("pool-name").textContent).toBe("poolio");
    expect(screen.getByTestId("pool-path").textContent).toBe("/path");
    expect(screen.getByTestId("pool-backend").textContent).toBe("zfs");
    expect(screen.getByTestId("pool-allocated").textContent).toBe("5KB");
    expect(screen.getByTestId("pool-free").textContent).toBe("8KB");
    expect(screen.getByTestId("pool-others").textContent).toBe("2KB");
  });

  it("does not display others data if none present", () => {
    const newPoolsData = { ...pools };
    newPoolsData.poolio.allocated_other = 0;
    render(<StoragePopover pools={newPoolsData}>Child</StoragePopover>);
    userEvent.tab();
    expect(screen.queryByTestId("others-col")).toBeNull();
    expect(screen.queryByTestId("pool-others")).toBeNull();
  });

  it("shows whether a pool is the default pool", () => {
    renderWithBrowserRouter(
      <StoragePopover defaultPoolId="abc123" pools={pools}>
        Child
      </StoragePopover>,
      "test-route"
    );
    userEvent.tab();
    expect(screen.getByText(/poolio \(default\)/i)).toBeInTheDocument();
  });
});
