import DeviceListHeader from "./DeviceListHeader";

import AddDeviceForm from "@/app/devices/components/AddDeviceForm";
import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
} from "@/testing/utils";

const { mockOpen } = await mockSidePanel();

const mockServer = setupMockServer(authResolvers.getMeEntitlements.handler());

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
    await userEvent.click(screen.getByRole("button", { name: "Add device" }));
    expect(mockOpen).toHaveBeenCalledWith(
      expect.objectContaining({
        component: AddDeviceForm,
        title: "Add device",
      })
    );
  });

  it("disables the Take action menu when no selected devices have the edit permission", () => {
    state.device.items = [
      factory.device({
        actions: [NodeActions.DELETE, NodeActions.SET_ZONE],
        permissions: [],
        system_id: "abc123",
      }),
      factory.device({ permissions: ["edit"], system_id: "def456" }),
    ];
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
      screen.getByRole("button", { name: /Take action/ })
    ).toBeAriaDisabled();
  });

  it("enables the Take action menu when a selected device has the edit permission", () => {
    state.device.items = [
      factory.device({
        actions: [],
        permissions: ["edit"],
        system_id: "abc123",
      }),
      factory.device({ permissions: [], system_id: "def456" }),
    ];
    renderWithProviders(
      <DeviceListHeader
        rowSelection={{
          [state.device.items[0].id]: true,
          [state.device.items[1].id]: true,
        }}
        searchFilter=""
        setRowSelection={vi.fn()}
        setSearchFilter={vi.fn()}
      />,
      { state }
    );
    expect(
      screen.getByRole("button", { name: /Take action/ })
    ).not.toBeAriaDisabled();
  });

  it("only counts selected devices with the edit permission for each action", async () => {
    state.device.items = [
      factory.device({ actions: [], permissions: ["edit"], system_id: "a" }),
      factory.device({ actions: [], permissions: ["edit"], system_id: "b" }),
      factory.device({
        actions: [NodeActions.DELETE, NodeActions.SET_ZONE],
        permissions: [],
        system_id: "c",
      }),
    ];
    renderWithProviders(
      <DeviceListHeader
        rowSelection={{
          [state.device.items[0].id]: true,
          [state.device.items[1].id]: true,
          [state.device.items[2].id]: true,
        }}
        searchFilter=""
        setRowSelection={vi.fn()}
        setSearchFilter={vi.fn()}
      />,
      { state }
    );
    await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
    expect(screen.getByRole("menuitem", { name: /Delete/ })).toHaveTextContent(
      "2"
    );
    expect(
      screen.getByRole("menuitem", { name: /Set zone/ })
    ).toHaveTextContent("2");
  });

  it("enables the add device button without any entitlements", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(
      <DeviceListHeader
        rowSelection={{}}
        searchFilter=""
        setRowSelection={vi.fn()}
        setSearchFilter={vi.fn()}
      />,
      { state }
    );
    expect(
      await screen.findByRole("button", { name: "Add device" })
    ).not.toBeAriaDisabled();
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
