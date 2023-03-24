import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeviceListHeader from "./DeviceListHeader";

import { DeviceHeaderViews } from "app/devices/constants";
import type { RootState } from "app/store/root/types";
import {
  device as deviceFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

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
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceListHeader
            setSearchFilter={jest.fn()}
            setSidePanelContent={jest.fn()}
            sidePanelContent={null}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays a devices count if devices have loaded", () => {
    state.device.loaded = true;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceListHeader
            setSearchFilter={jest.fn()}
            setSidePanelContent={jest.fn()}
            sidePanelContent={null}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("section-header-subtitle")).toHaveTextContent(
      "2 devices available"
    );
  });

  it("disables the add device button if any devices are selected", () => {
    state.device.selected = ["abc123"];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceListHeader
            setSearchFilter={jest.fn()}
            setSidePanelContent={jest.fn()}
            sidePanelContent={null}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("add-device-button")).toBeDisabled();
  });

  it("can open the add device form", () => {
    const setSidePanelContent = jest.fn();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceListHeader
            setSearchFilter={jest.fn()}
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={null}
          />
        </MemoryRouter>
      </Provider>
    );
    screen.getByTestId("add-device-button").click();
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: DeviceHeaderViews.ADD_DEVICE,
    });
  });
});
