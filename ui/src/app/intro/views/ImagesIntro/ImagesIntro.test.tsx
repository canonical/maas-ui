import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ImagesIntro from "./ImagesIntro";

import type { RootState } from "app/store/root/types";
import {
  bootResource as bootResourceFactory,
  bootResourceState as bootResourceStateFactory,
  bootResourceUbuntu as bootResourceUbuntuFactory,
  bootResourceUbuntuSource as bootResourceUbuntuSourceFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ImagesIntro", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [bootResourceFactory()],
        ubuntu: bootResourceUbuntuFactory(),
      }),
    });
  });

  it("displays a spinner if server has not been polled yet", () => {
    state.bootresource.ubuntu = null;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <ImagesIntro />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("disables the continue button if no image and source has been configured", () => {
    state.bootresource.ubuntu = bootResourceUbuntuFactory({ sources: [] });
    state.bootresource.resources = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <ImagesIntro />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("button[data-test='images-intro-continue']").prop("disabled")
    ).toBe(true);
    expect(
      wrapper
        .find("[data-test='images-intro-continue'] Tooltip")
        .prop("message")
    ).toBe("At least one image and source must be configured to continue.");
  });

  it("enables the continue button if an image and source has been configured", () => {
    state.bootresource.ubuntu = bootResourceUbuntuFactory({
      sources: [bootResourceUbuntuSourceFactory()],
    });
    state.bootresource.resources = [bootResourceFactory()];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <ImagesIntro />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("button[data-test='images-intro-continue']").prop("disabled")
    ).toBe(false);
  });
});
