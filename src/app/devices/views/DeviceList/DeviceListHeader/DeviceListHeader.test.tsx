import DeviceListHeader from "./DeviceListHeader";

import AddDeviceForm from "@/app/devices/components/AddDeviceForm";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  userEvent,
} from "@/testing/utils";

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
      <DeviceListHeader searchFilter="" setSearchFilter={vi.fn()} />,
      { state }
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays a devices count if devices have loaded", () => {
    state.device.loaded = true;
    renderWithProviders(
      <DeviceListHeader searchFilter="" setSearchFilter={vi.fn()} />,
      { state }
    );
    expect(screen.getByText("2 devices available")).toBeInTheDocument();
  });

  it("disables the add device button if any devices are selected", () => {
    state.device.selected = ["abc123"];
    renderWithProviders(
      <DeviceListHeader searchFilter="" setSearchFilter={vi.fn()} />,
      { state }
    );
    expect(
      screen.getByRole("button", { name: "Add device" })
    ).toBeAriaDisabled();
  });

  it("can open the add device form", async () => {
    renderWithProviders(
      <DeviceListHeader searchFilter="" setSearchFilter={vi.fn()} />,
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

  it("changes the search text when the filters change", () => {
    const { rerender } = renderWithProviders(
      <DeviceListHeader searchFilter="" setSearchFilter={vi.fn()} />,
      { state }
    );

    expect(screen.getByRole("searchbox")).toHaveValue("");

    rerender(
      <DeviceListHeader searchFilter="free-text" setSearchFilter={vi.fn()} />
    );

    expect(screen.getByRole("searchbox")).toHaveValue("free-text");
  });
});
