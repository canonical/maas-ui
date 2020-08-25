import React from "react";
import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import {
  pod as podFactory,
  podHint as podHintFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import KVMAggregateResources from "./KVMAggregateResources";

const mockStore = configureStore();

describe("KVMAggregateResources", () => {
  it("correctly displays cpu core information", () => {
    const pod = podFactory({
      cpu_over_commit_ratio: 3,
      id: 1,
      total: podHintFactory({ cores: 4 }),
      used: podHintFactory({ cores: 2 }),
    });
    const state = rootStateFactory({ pod: podStateFactory({ items: [pod] }) });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <KVMAggregateResources id={pod.id} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-test='cpu-meter'] [data-test='total']").text()
    ).toBe("12");
    expect(
      wrapper.find("[data-test='cpu-meter'] [data-test='allocated']").text()
    ).toBe("2");
    expect(
      wrapper.find("[data-test='cpu-meter'] [data-test='free']").text()
    ).toBe("10");
  });

  it("correctly displays general RAM information", () => {
    const pod = podFactory({
      memory_over_commit_ratio: 2,
      id: 1,
      total: podHintFactory({ memory: 2 }),
      used: podHintFactory({ memory: 1 }),
    });
    const state = rootStateFactory({ pod: podStateFactory({ items: [pod] }) });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <KVMAggregateResources id={pod.id} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='ram-general-allocated']").text()).toBe(
      "1MiB"
    );
    expect(wrapper.find("[data-test='ram-general-free']").text()).toBe("3MiB");
  });
});
