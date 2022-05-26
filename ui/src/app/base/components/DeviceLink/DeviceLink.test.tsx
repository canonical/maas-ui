import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DeviceLink from "./DeviceLink";

import deviceURLs from "app/devices/urls";
import {
  device as deviceFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("handles when devices are loading", () => {
  const state = rootStateFactory({
    device: deviceStateFactory({ items: [], loading: true }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <DeviceLink systemId="abc123" />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByLabelText("Loading devices")).toBeInTheDocument();
});

it("handles when a device does not exist", () => {
  const state = rootStateFactory({
    device: deviceStateFactory({ items: [], loading: false }),
  });
  const store = mockStore(state);
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <DeviceLink systemId="abc123" />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(container).toBeEmptyDOMElement();
});

it("renders a link if devices have loaded and it exists", () => {
  const device = deviceFactory();
  const state = rootStateFactory({
    device: deviceStateFactory({ items: [device], loading: false }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <DeviceLink systemId={device.system_id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    deviceURLs.device.index({ id: device.system_id })
  );
});
