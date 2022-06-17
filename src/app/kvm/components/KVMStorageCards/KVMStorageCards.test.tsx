import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMStorageCards, { TRUNCATION_POINT } from "./KVMStorageCards";

import * as hooks from "app/base/hooks/analytics";
import { ConfigNames } from "app/store/config/types";
import {
  config as configFactory,
  configState as configStateFactory,
  podStoragePoolResource as podStoragePoolFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMStorageCards", () => {
  it("shows sort label as sorting by default then id if default pool id provided", () => {
    const pools = {
      a: podStoragePoolFactory(),
    };
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <KVMStorageCards defaultPoolId="a" pools={pools} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='sort-label']").text()).toBe(
      "(Sorted by id, default first)"
    );
  });

  it("shows sort label as sorting by name if no default pool id provided", () => {
    const pools = {
      a: podStoragePoolFactory(),
    };
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <KVMStorageCards pools={pools} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='sort-label']").text()).toBe(
      "(Sorted by name)"
    );
  });

  it("can expand truncated pools if above truncation point", () => {
    const pools = {
      a: podStoragePoolFactory(),
      b: podStoragePoolFactory(),
      c: podStoragePoolFactory(),
      d: podStoragePoolFactory(),
      e: podStoragePoolFactory(),
    };
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <KVMStorageCards pools={pools} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Button[data-testid='show-more-pools']").exists()).toBe(
      true
    );
    expect(wrapper.find("Card").length).toBe(TRUNCATION_POINT);

    act(() => {
      wrapper.find("Button[data-testid='show-more-pools']").simulate("click");
    });
    wrapper.update();

    expect(
      wrapper.find("Button[data-testid='show-more-pools'] span").text()
    ).toBe("Show less storage pools");
    expect(wrapper.find("Card").length).toBe(Object.keys(pools).length);
  });

  it("can send an analytics event when expanding pools if analytics enabled", () => {
    const pools = {
      a: podStoragePoolFactory(),
      b: podStoragePoolFactory(),
      c: podStoragePoolFactory(),
      d: podStoragePoolFactory(),
      e: podStoragePoolFactory(),
    };
    const mockSendAnalytics = jest.fn();
    const mockUseSendAnalytics = jest
      .spyOn(hooks, "useSendAnalytics")
      .mockImplementation(() => mockSendAnalytics);

    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.ENABLE_ANALYTICS,
            value: false,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <KVMStorageCards pools={pools} />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.find("Button[data-testid='show-more-pools']").simulate("click");
    });
    wrapper.update();

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "KVM details",
      "Toggle expanded storage pools",
      "Show more storage pools",
    ]);

    mockUseSendAnalytics.mockRestore();
  });
});
