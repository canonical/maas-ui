import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import VmResources from "./VmResources";

import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("VmResources", () => {
  it("shows a spinner id machines are loading", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/2", key: "testKey" }]}>
          <VmResources loading vms={[]} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("disables the dropdown if no VMs are provided", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/2", key: "testKey" }]}>
          <VmResources vms={[]} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("ContextualMenu[data-testid='vms-dropdown']")
        .prop("toggleDisabled")
    ).toBe(true);
  });
});
