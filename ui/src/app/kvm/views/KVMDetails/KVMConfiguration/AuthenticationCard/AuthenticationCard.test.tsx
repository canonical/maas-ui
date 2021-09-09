import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AuthenticationCard from "./AuthenticationCard";

import {
  podCertificate as certificateFactory,
  podDetails as podFactory,
  podPowerParameters as powerParametersFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
const mockStore = configureStore();

describe("AuthenticationCard", () => {
  it("does not render if the pod has no certificate metadata", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            certificate: undefined,
            power_parameters: powerParametersFactory({
              certificate: "abc123",
              key: "abc123",
            }),
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <AuthenticationCard id={1} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='authentication-card']").exists()).toBe(
      false
    );
  });

  it("renders if the pod has certificate metadata", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            certificate: certificateFactory(),
            power_parameters: powerParametersFactory({
              certificate: "abc123",
              key: "abc123",
            }),
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <AuthenticationCard id={1} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='authentication-card']").exists()).toBe(
      true
    );
  });

  it("can toggle displaying the private key", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            certificate: certificateFactory(),
            power_parameters: powerParametersFactory({
              certificate: "abc123",
              key: "abc123",
            }),
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <AuthenticationCard id={1} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='private-key']").exists()).toBe(false);

    wrapper.find("Button[data-test='toggle-key']").simulate("click");
    expect(wrapper.find("[data-test='private-key']").exists()).toBe(true);

    wrapper.find("Button[data-test='toggle-key']").simulate("click");
    expect(wrapper.find("[data-test='private-key']").exists()).toBe(false);
  });
});
