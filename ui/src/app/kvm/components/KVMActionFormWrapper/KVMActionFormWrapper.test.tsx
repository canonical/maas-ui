import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMActionFormWrapper from "./KVMActionFormWrapper";

import { PodAction, PodType } from "app/store/pod/types";
import { NodeActions } from "app/store/types/node";
import {
  pod as podFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMActionFormWrapper", () => {
  let initialState = rootStateFactory();

  beforeEach(() => {
    initialState = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({ id: 1, name: "pod-1", type: PodType.LXD }),
          podFactory({ id: 2, name: "pod-2", type: PodType.VIRSH }),
        ],
        statuses: {
          1: podStatusFactory(),
          2: podStatusFactory(),
        },
      }),
    });
  });

  it("does not render if headerContent is not defined", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMActionFormWrapper
            headerContent={null}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='kvm-action-form-wrapper']").exists()).toBe(
      false
    );
  });

  it("renders ComposeForm if compose action selected", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMActionFormWrapper
            headerContent={PodAction.COMPOSE}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("ComposeForm").exists()).toBe(true);
  });

  it("renders DeleteForm if delete action selected", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMActionFormWrapper
            headerContent={PodAction.DELETE}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("DeleteForm").exists()).toBe(true);
  });

  it("renders RefreshForm if refresh action selected", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMActionFormWrapper
            headerContent={PodAction.REFRESH}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("RefreshForm").exists()).toBe(true);
  });

  it("renders machine action forms if a machine action is selected", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMActionFormWrapper
            headerContent={{ name: NodeActions.COMMISSION }}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("ActionFormWrapper CommissionForm").exists()).toBe(
      true
    );
  });
});
