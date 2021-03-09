import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LxdProject from "./LxdProject";

import { PodType } from "app/store/pod/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LxdProject", () => {
  it("shows a spinner if pods have not loaded yet", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [],
        loaded: false,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LxdProject id={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("shows a message if the pod can't be found", () => {
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
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LxdProject id={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='not-found']").exists()).toBe(true);
  });

  it("redirects to resources page if pod is not a LXD pod", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1, type: PodType.VIRSH })],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LxdProject id={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Redirect").exists()).toBe(true);
    expect(wrapper.find("Redirect").prop("to")).toBe("/kvm/1/resources");
  });

  it("can display the project name", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({ id: 1, project: "blair-witch", type: PodType.LXD }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LxdProject id={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='project-name']").text()).toBe(
      "blair-witch"
    );
  });
});
