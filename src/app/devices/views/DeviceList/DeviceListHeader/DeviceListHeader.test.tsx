import { MemoryRouter } from "react-router-dom";

import DeviceListHeader from "./DeviceListHeader";

import { DeviceHeaderViews } from "app/devices/constants";
import type { RootState } from "app/store/root/types";
import {
  device as deviceFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

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
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
      />,
      { state }
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays a devices count if devices have loaded", () => {
    state.device.loaded = true;
    renderWithBrowserRouter(
      <DeviceListHeader
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
      />,
      { state }
    );
    expect(screen.getByTestId("section-header-subtitle")).toHaveTextContent(
      "2 devices available"
    );
  });

  it("disables the add device button if any devices are selected", () => {
    state.device.selected = ["abc123"];
    renderWithBrowserRouter(
      <DeviceListHeader
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
      />,
      { state }
    );
    expect(screen.getByTestId("add-device-button")).toBeDisabled();
  });

  it("can open the add device form", async () => {
    const setSidePanelContent = jest.fn();
    renderWithBrowserRouter(
      <MemoryRouter>
        <DeviceListHeader
          setSearchFilter={jest.fn()}
          setSidePanelContent={setSidePanelContent}
          sidePanelContent={null}
        />
      </MemoryRouter>,
      { state }
    );
    await userEvent.click(screen.getByTestId("add-device-button"));
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: DeviceHeaderViews.ADD_DEVICE,
    });
  });
});
