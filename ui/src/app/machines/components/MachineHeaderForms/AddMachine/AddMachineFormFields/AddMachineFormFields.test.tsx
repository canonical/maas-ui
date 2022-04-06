import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddMachineForm from "../AddMachineForm";

import { ACTION_STATUS } from "app/base/constants";
import type { RootState } from "app/store/root/types";
import { ZONE_ACTIONS } from "app/store/zone/constants";
import {
  architecturesState as architecturesStateFactory,
  defaultMinHweKernelState as defaultMinHweKernelStateFactory,
  domain as domainFactory,
  domainState as domainStateFactory,
  generalState as generalStateFactory,
  hweKernelsState as hweKernelsStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AddMachineFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory()],
        loaded: true,
      }),
      general: generalStateFactory({
        architectures: architecturesStateFactory({
          data: ["amd64/generic"],
          loaded: true,
        }),
        defaultMinHweKernel: defaultMinHweKernelStateFactory({
          data: "ga-16.04",
          loaded: true,
        }),
        hweKernels: hweKernelsStateFactory({
          data: [
            ["ga-16.04", "xenial (ga-16.04)"],
            ["ga-18.04", "bionic (ga-18.04)"],
          ],
          loaded: true,
        }),
        powerTypes: powerTypesStateFactory({
          data: [
            powerTypeFactory({
              name: "manual",
              description: "Manual",
              fields: [],
            }),
          ],
          loaded: true,
        }),
      }),
      resourcepool: resourcePoolStateFactory({
        items: [resourcePoolFactory()],
        loaded: true,
      }),
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.success,
        }),
        items: [zoneFactory()],
      }),
    });
  });

  it("correctly sets minimum kernel to default", () => {
    state.general.defaultMinHweKernel.data = "ga-18.04";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddMachineForm clearHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Select[name='min_hwe_kernel']").props().value).toBe(
      "ga-18.04"
    );
  });

  it("can add extra mac address fields", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddMachineForm clearHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='extra-macs-0']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='extra-macs-1']").exists()).toBe(false);
    await act(async () => {
      wrapper.find("[data-testid='add-extra-mac'] button").simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("[data-testid='extra-macs-0']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='extra-macs-1']").exists()).toBe(false);
    await act(async () => {
      wrapper.find("[data-testid='add-extra-mac'] button").simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("[data-testid='extra-macs-0']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='extra-macs-1']").exists()).toBe(true);
  });

  it("can remove extra mac address fields", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddMachineForm clearHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      wrapper.find("[data-testid='add-extra-mac'] button").simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("[data-testid='extra-macs-0']").exists()).toBe(true);
    await act(async () => {
      wrapper.find("[data-testid='extra-macs-0'] button").simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("[data-testid='extra-macs-0']").exists()).toBe(false);
  });

  it("does not require MAC address field if power_type is 'ipmi'", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddMachineForm clearHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    // Power type is "manual" by default, therefore MAC address is required.
    expect(wrapper.find("Input[name='pxe_mac']").props().required).toBe(true);
    // Select the ipmi power type from the dropdown.
    await act(async () => {
      wrapper
        .find("select[name='power_type']")
        .simulate("change", { target: { name: "power_type", value: "ipmi" } });
    });
    wrapper.update();
    // "ipmi" power type should not require MAC address.
    expect(wrapper.find("Input[name='pxe_mac']").props().required).toBe(false);
  });
});
