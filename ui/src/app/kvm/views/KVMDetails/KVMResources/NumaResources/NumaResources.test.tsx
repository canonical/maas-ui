import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import NumaResources, { TRUNCATION_POINT } from "./NumaResources";

import * as hooks from "app/base/hooks";
import {
  config as configFactory,
  configState as configStateFactory,
  pod as podFactory,
  podNuma as podNumaFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("NumaResources", () => {
  it("can expand truncated NUMA nodes if above truncation point", async () => {
    const pod = podFactory({
      id: 1,
      resources: podResourcesFactory({
        numa: Array.from(Array(TRUNCATION_POINT + 1)).map(() =>
          podNumaFactory()
        ),
      }),
    });
    const state = rootStateFactory({ pod: podStateFactory({ items: [pod] }) });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <NumaResources id={pod.id} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Button[data-test='show-more-numas']").exists()).toBe(
      true
    );
    expect(wrapper.find("NumaResourcesCard").length).toBe(TRUNCATION_POINT);

    wrapper.find("Button[data-test='show-more-numas']").simulate("click");
    await waitForComponentToPaint(wrapper);

    expect(
      wrapper.find("Button[data-test='show-more-numas'] span").text()
    ).toBe("Show less NUMA nodes");
    expect(wrapper.find("NumaResourcesCard").length).toBe(TRUNCATION_POINT + 1);
  });

  it("shows wide cards if the pod has less than or equal to 2 NUMA nodes", () => {
    const pod = podFactory({
      id: 1,
      resources: podResourcesFactory({
        numa: [podNumaFactory()],
      }),
    });
    const state = rootStateFactory({ pod: podStateFactory({ items: [pod] }) });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <NumaResources id={pod.id} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find(".numa-resources.is-wide").exists()).toBe(true);
  });

  it("can send an analytics event when expanding NUMA nodes if analytics enabled", async () => {
    const pod = podFactory({
      id: 1,
      resources: podResourcesFactory({
        numa: Array.from(Array(TRUNCATION_POINT + 1)).map(() =>
          podNumaFactory()
        ),
      }),
    });
    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: "enable_analytics",
            value: false,
          }),
        ],
      }),
      pod: podStateFactory({ items: [pod] }),
    });
    const useSendMock = jest.spyOn(hooks, "useSendAnalytics");
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <NumaResources id={pod.id} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Button[data-test='show-more-numas']").simulate("click");
    await waitForComponentToPaint(wrapper);

    expect(useSendMock).toHaveBeenCalled();
    useSendMock.mockRestore();
  });
});
