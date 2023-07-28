import StoragePopover from "./StoragePopover";

import { podStoragePoolResource as podStoragePoolResourceFactory } from "testing/factories";
import { fireEvent, render, screen } from "testing/utils";

describe("StoragePopover", () => {
  const body = document.querySelector("body");
  const app = document.createElement("div");
  if (body && app) {
    app.setAttribute("id", "app");
    body.appendChild(app);
  }

  it("correctly displays storage data", () => {
    const pools = {
      poolio: podStoragePoolResourceFactory({
        allocated_other: 2000,
        allocated_tracked: 5000,
        backend: "zfs",
        path: "/path",
        total: 15000,
      }),
    };
    render(<StoragePopover pools={pools}>Child</StoragePopover>);

    fireEvent.focus(screen.getByTestId("popover-container"));

    expect(screen.getByTestId("pool-name")).toHaveTextContent("poolio");
    expect(screen.getByTestId("pool-path")).toHaveTextContent("/path");
    expect(screen.getByTestId("pool-backend")).toHaveTextContent("zfs");
    expect(screen.getByTestId("pool-allocated")).toHaveTextContent("5KB");
    expect(screen.getByTestId("pool-free")).toHaveTextContent("8KB");
    expect(screen.getByTestId("pool-others")).toHaveTextContent("2KB");
  });

  it("does not display others data if none present", () => {
    const pools = {
      poolio: podStoragePoolResourceFactory({
        allocated_other: 0,
        allocated_tracked: 5000,
        backend: "zfs",
        path: "/path",
        total: 15000,
      }),
    };
    render(<StoragePopover pools={pools}>Child</StoragePopover>);
    fireEvent.focus(screen.getByTestId("popover-container"));
    expect(screen.queryByTestId("others-col")).not.toBeInTheDocument();
    expect(screen.queryByTestId("pool-others")).not.toBeInTheDocument();
  });

  it("shows whether a pool is the default pool", () => {
    const pools = {
      poolio: podStoragePoolResourceFactory({ id: "abc123" }),
    };

    render(
      <StoragePopover defaultPoolId="abc123" pools={pools}>
        Child
      </StoragePopover>
    );

    fireEvent.focus(screen.getByTestId("popover-container"));
    expect(screen.getByTestId("pool-name")).toHaveTextContent(
      "poolio (default)"
    );
  });
});
