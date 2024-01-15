import { MemoryRouter } from "react-router-dom";

import DeviceListHeader from "./DeviceListHeader";

import { DeviceSidePanelViews } from "@/app/devices/constants";
import type { RootState } from "@/app/store/root/types";
import {
  device as deviceFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
} from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

describe("DeviceListHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      device: deviceStateFactory({
        loaded: true,
        items: [
          deviceFactory({ system_id: "abc123" }),
          deviceFactory({ system_id: "def456" }),
        ],
      }),
    });
  });

  it("displays a spinner in the header subtitle if devices have not loaded", () => {
    state.device.loaded = false;
    renderWithBrowserRouter(
      <DeviceListHeader
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { state }
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays a devices count if devices have loaded", () => {
    state.device.loaded = true;
    renderWithBrowserRouter(
      <DeviceListHeader
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { state }
    );
    expect(screen.getByText("2 devices available")).toBeInTheDocument();
  });

  it("disables the add device button if any devices are selected", () => {
    state.device.selected = ["abc123"];
    renderWithBrowserRouter(
      <DeviceListHeader
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { state }
    );
    expect(screen.getByRole("button", { name: "Add device" })).toBeDisabled();
  });

  it("can open the add device form", async () => {
    const setSidePanelContent = vi.fn();
    renderWithBrowserRouter(
      <MemoryRouter>
        <DeviceListHeader
          searchFilter=""
          setSearchFilter={vi.fn()}
          setSidePanelContent={setSidePanelContent}
        />
      </MemoryRouter>,
      { state }
    );
    await userEvent.click(screen.getByRole("button", { name: "Add device" }));
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: DeviceSidePanelViews.ADD_DEVICE,
    });
  });

  it("changes the search text when the filters change", () => {
    const { rerender } = renderWithBrowserRouter(
      <DeviceListHeader
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { state }
    );

    expect(screen.getByRole("searchbox")).toHaveValue("");

    rerender(
      <DeviceListHeader
        searchFilter="free-text"
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />
    );

    expect(screen.getByRole("searchbox")).toHaveValue("free-text");
  });
});
