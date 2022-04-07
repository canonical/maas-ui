import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeviceConfiguration, { Label } from "./DeviceConfiguration";
import { Label as DeviceConfigurationFieldsLabel } from "./DeviceConfigurationFields/DeviceConfigurationFields";

import { Label as TagFieldLabel } from "app/base/components/TagField/TagField";
import { Label as ZoneSelectLabel } from "app/base/components/ZoneSelect/ZoneSelect";
import { actions as deviceActions } from "app/store/device";
import type { RootState } from "app/store/root/types";
import {
  deviceDetails as deviceDetailsFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DeviceConfiguration", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      device: deviceStateFactory({
        items: [deviceDetailsFactory({ system_id: "abc123" })],
        loaded: true,
      }),
      tag: tagStateFactory({
        items: [
          tagFactory({ id: 1, name: "tag1" }),
          tagFactory({ id: 2, name: "tag2" }),
        ],
      }),
      zone: zoneStateFactory({
        loaded: true,
        items: [zoneFactory({ name: "twilight" })],
      }),
    });
  });

  it("displays a spinner if the device has not loaded yet", () => {
    state.device.items = [];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceConfiguration systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("loading-device")).toBeInTheDocument();
  });

  it("shows the device details by default", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceConfiguration systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("device-details")).toBeInTheDocument();
    expect(
      screen.queryByRole("form", { name: Label.Form })
    ).not.toBeInTheDocument();
  });

  it("can switch to showing the device configuration form", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceConfiguration systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    userEvent.click(screen.getByRole("button", { name: Label.Edit }));

    expect(screen.queryByTestId("device-details")).not.toBeInTheDocument();
    expect(screen.getByRole("form", { name: Label.Form })).toBeInTheDocument();
  });

  it("correctly dispatches an action to update a device", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceConfiguration systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    userEvent.click(screen.getByRole("button", { name: Label.Edit }));
    const deviceNote = screen.getByRole("textbox", {
      name: DeviceConfigurationFieldsLabel.Note,
    });
    userEvent.clear(deviceNote);
    userEvent.type(deviceNote, "it's a device");
    userEvent.selectOptions(
      screen.getByRole("combobox", { name: ZoneSelectLabel.Zone }),
      "twilight"
    );
    // Open the tag selector dropdown.
    screen.getByRole("textbox", { name: TagFieldLabel.Input }).focus();
    userEvent.click(screen.getByRole("option", { name: "tag1" }));
    userEvent.click(screen.getByRole("option", { name: "tag2" }));
    fireEvent.submit(screen.getByRole("form", { name: Label.Form }));
    const expectedAction = deviceActions.update({
      description: "it's a device",
      tags: [1, 2],
      system_id: "abc123",
      zone: { name: "twilight" },
    });
    const actualActions = store.getActions();
    await waitFor(() =>
      expect(
        actualActions.find((action) => action.type === expectedAction.type)
      ).toStrictEqual(expectedAction)
    );
  });
});
