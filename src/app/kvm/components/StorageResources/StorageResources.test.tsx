import StorageResources from "./StorageResources";

import { podStoragePoolResource as storagePoolResourceFactory } from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

describe("StorageResources", () => {
  it("displays as a meter if there is only one pool", () => {
    const storagePools = {
      "pool-0": storagePoolResourceFactory({
        allocated_other: 1,
        allocated_tracked: 2,
        path: "/path/0",
        total: 7,
      }),
    };
    renderWithBrowserRouter(
      <StorageResources allocated={3} free={4} pools={storagePools} />
    );
    expect(screen.getByRole("meter")).toBeInTheDocument();
    expect(screen.queryByTestId("storage-summary")).not.toBeInTheDocument();
    expect(screen.queryByText(/Storage Cards/)).not.toBeInTheDocument();
  });

  it("displays storage summary and pools as cards if there is more than one pool", () => {
    const storagePools = {
      "pool-0": storagePoolResourceFactory({
        allocated_other: 0,
        allocated_tracked: 1,
        path: "/path/0",
        total: 2,
      }),
      "pool-1": storagePoolResourceFactory({
        allocated_other: 1,
        allocated_tracked: 2,
        path: "/path/0",
        total: 4,
      }),
    };
    renderWithBrowserRouter(
      <StorageResources allocated={5} free={6} pools={storagePools} />
    );
    expect(screen.getByText(/Storage Cards/)).toBeInTheDocument();
    expect(screen.getByTestId("storage-summary")).toBeInTheDocument();
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
  });
});
