import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AuthenticationCard from "./AuthenticationCard";

import { PodType } from "app/store/pod/constants";
import type { PodDetails } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  podCertificate as certificateFactory,
  podDetails as podFactory,
  podPowerParameters as powerParametersFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
const mockStore = configureStore();

describe("AuthenticationCard", () => {
  let state: RootState;
  let pod: PodDetails;

  beforeEach(() => {
    pod = podFactory({
      certificate: certificateFactory(),
      id: 1,
      power_parameters: powerParametersFactory({
        certificate: "abc123",
        key: "abc123",
      }),
      type: PodType.LXD,
    });
    state = rootStateFactory({
      pod: podStateFactory({ items: [pod] }),
    });
  });

  it("can toggle displaying the private key", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <AuthenticationCard pod={pod} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='private-key']").exists()).toBe(false);

    wrapper.find("Button[data-test='toggle-key']").simulate("click");
    expect(wrapper.find("[data-test='private-key']").exists()).toBe(true);

    wrapper.find("Button[data-test='toggle-key']").simulate("click");
    expect(wrapper.find("[data-test='private-key']").exists()).toBe(false);
  });

  it("can open the update certificate form", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <AuthenticationCard pod={pod} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("UpdateCertificate").exists()).toBe(false);

    wrapper
      .find("Button[data-test='show-update-certificate']")
      .simulate("click");
    expect(wrapper.find("UpdateCertificate").exists()).toBe(true);
  });

  it("opens the update certificate form automatically if pod has no certificate", () => {
    pod.certificate = undefined;
    pod.power_parameters.certificate = undefined;
    pod.power_parameters.key = undefined;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <AuthenticationCard pod={pod} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("UpdateCertificate").exists()).toBe(true);
  });
});
