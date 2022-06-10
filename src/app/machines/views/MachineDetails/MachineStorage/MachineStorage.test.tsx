import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MachineStorage from "./MachineStorage";

import * as hooks from "app/base/hooks/analytics";
import {
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("displays a spinner if machine is loading", () => {
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [],
    }),
  });
  const store = mockStore(state);
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
      >
        <CompatRouter>
          <MachineStorage />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(wrapper.find("Spinner").exists()).toBe(true);
});

it("renders storage layout dropdown if machine's storage can be edited", () => {
  const state = rootStateFactory({
    general: generalStateFactory({
      powerTypes: powerTypesStateFactory({
        data: [powerTypeFactory()],
      }),
    }),
    machine: machineStateFactory({
      items: [
        machineDetailsFactory({
          locked: false,
          permissions: ["edit"],
          system_id: "abc123",
        }),
      ],
      statuses: machineStatusesFactory({
        abc123: machineStatusFactory(),
      }),
    }),
  });
  const store = mockStore(state);
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          { pathname: "/machine/abc123/storage", key: "testKey" },
        ]}
      >
        <CompatRouter>
          <Route
            exact
            path="/machine/:id/storage"
            render={() => <MachineStorage />}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(wrapper.find("ChangeStorageLayout").exists()).toBe(true);
});

it("sends an analytics event when clicking on the MAAS docs footer link", () => {
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machineDetailsFactory({ system_id: "abc123" })],
      loaded: true,
    }),
  });
  const store = mockStore(state);
  const mockSendAnalytics = jest.fn();
  const mockUseSendAnalytics = jest
    .spyOn(hooks, "useSendAnalytics")
    .mockImplementation(() => mockSendAnalytics);
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          { pathname: "/machine/abc123/storage", key: "testKey" },
        ]}
      >
        <CompatRouter>
          <Route
            exact
            path="/machine/:id/storage"
            render={() => <MachineStorage />}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  act(() => {
    wrapper.find("[data-testid='docs-footer-link']").simulate("click");
  });
  wrapper.update();

  expect(mockSendAnalytics).toHaveBeenCalled();
  expect(mockSendAnalytics.mock.calls[0]).toEqual([
    "Machine storage",
    "Click link to MAAS docs",
    "Windows",
  ]);

  mockUseSendAnalytics.mockRestore();
});
