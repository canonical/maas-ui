import DeviceListHeader from "./DeviceListHeader";

import AddDeviceForm from "@/app/devices/components/AddDeviceForm";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

const { mockOpen } = await mockSidePanel();

describe("DeviceListHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      device: factory.deviceState({
        loaded: true,
        items: [
          factory.device({ system_id: "abc123" }),
          factory.device({ system_id: "def456" }),
        ],
      }),
    });
  });

  it("displays a spinner in the header subtitle if devices have not loaded", () => {
    state.device.loaded = false;
    renderWithProviders(
      <DeviceListHeader
        rowSelection={{}}
        searchFilter=""
        setRowSelection={vi.fn()}
        setSearchFilter={vi.fn()}
      />,
      { state }
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays a devices count if devices have loaded", () => {
    state.device.loaded = true;
    renderWithProviders(
      <DeviceListHeader
        rowSelection={{}}
        searchFilter=""
        setRowSelection={vi.fn()}
        setSearchFilter={vi.fn()}
      />,
      { state }
    );
    expect(screen.getByText("2 devices available")).toBeInTheDocument();
  });

  it("disables the add device button if any devices are selected", () => {
    renderWithProviders(
      <DeviceListHeader
        rowSelection={{ [state.device.items[0].id]: true }}
        searchFilter=""
        setRowSelection={vi.fn()}
        setSearchFilter={vi.fn()}
      />,
      { state }
    );
    expect(
      screen.getByRole("button", { name: "Add device" })
    ).toBeAriaDisabled();
  });

  it("can open the add device form", async () => {
    renderWithProviders(
      <DeviceListHeader
        rowSelection={{}}
        searchFilter=""
        setRowSelection={vi.fn()}
        setSearchFilter={vi.fn()}
      />,
      { state }
    );
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add device" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Add device" }));
    expect(mockOpen).toHaveBeenCalledWith(
      expect.objectContaining({
        component: AddDeviceForm,
        title: "Add device",
      })
    );
  });

  it("disables the add device button and take action dropdown without the edit entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(
      <DeviceListHeader
        rowSelection={{ [state.device.items[0].id]: true }}
        searchFilter=""
        setRowSelection={vi.fn()}
        setSearchFilter={vi.fn()}
      />,
      { state }
    );
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add device" })
      ).toBeAriaDisabled();
    });
    expect(
      screen.getByRole("button", { name: "Take action" })
    ).toBeAriaDisabled();
  });

  it("changes the search text when the filters change", () => {
    const { rerender } = renderWithProviders(
      <DeviceListHeader
        rowSelection={{}}
        searchFilter=""
        setRowSelection={vi.fn()}
        setSearchFilter={vi.fn()}
      />,
      { state }
    );

    expect(screen.getByRole("searchbox")).toHaveValue("");

    rerender(
      <DeviceListHeader
        rowSelection={{}}
        searchFilter="free-text"
        setRowSelection={vi.fn()}
        setSearchFilter={vi.fn()}
      />
    );

    expect(screen.getByRole("searchbox")).toHaveValue("free-text");
  });
});
