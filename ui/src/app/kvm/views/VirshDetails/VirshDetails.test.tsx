import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import VirshDetails from "./VirshDetails";

import kvmURLs from "app/kvm/urls";
import {
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VirshDetails", () => {
  it("redirects to KVM list if pods have loaded but pod is not in state", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.virsh.details.index({ id: 1 }),
              key: "testKey",
            },
          ]}
        >
          <VirshDetails />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
    expect(wrapper.find("Redirect").props().to).toBe(kvmURLs.kvm);
  });
});
