import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ClearAllForm from "./ClearAllForm";

import FormikFormContent from "app/base/components/FormikFormContent";
import { NetworkDiscovery } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  discovery as discoveryFactory,
  discoveryState as discoveryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("ClearAllForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: "network_discovery", value: NetworkDiscovery.ENABLED }],
      }),
      discovery: discoveryStateFactory({
        loaded: true,
        items: [
          discoveryFactory({
            hostname: "my-discovery-test",
          }),
          discoveryFactory({
            hostname: "another-test",
          }),
        ],
      }),
    });
  });

  it("displays a message when discovery is enabled", () => {
    state.config = configStateFactory({
      items: [{ name: "network_discovery", value: NetworkDiscovery.ENABLED }],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <ClearAllForm closeForm={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='enabled-message']").exists()).toBe(true);
  });

  it("displays a message when discovery is enabled", () => {
    state.config = configStateFactory({
      items: [{ name: "network_discovery", value: NetworkDiscovery.DISABLED }],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <ClearAllForm closeForm={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='disabled-message']").exists()).toBe(
      true
    );
  });

  it("dispatches an action to clear the discoveries", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <ClearAllForm closeForm={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(wrapper);
    expect(
      store.getActions().some(({ type }) => type === "discovery/clear")
    ).toBe(true);
  });

  it("shows a success message when completed", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <ClearAllForm closeForm={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    const onSuccess = wrapper.find(FormikFormContent).prop("onSuccess");
    onSuccess && onSuccess({});
    expect(store.getActions().some(({ type }) => type === "message/add")).toBe(
      true
    );
  });
});
