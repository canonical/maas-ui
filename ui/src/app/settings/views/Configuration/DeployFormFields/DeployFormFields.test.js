import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";

import DeployForm from "../DeployForm";

jest.mock("uuid/v4", () =>
  jest.fn(() => "00000000-0000-0000-0000-000000000000")
);

const mockStore = configureStore();

describe("DeployFormFields", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "default_osystem",
            value: "ubuntu",
            choices: [["centos", "CentOS"], ["ubuntu", "Ubuntu"]]
          },
          {
            name: "default_distro_series",
            value: "bionic",
            choices: [
              ["precise", 'Ubuntu 12.04 LTS "Precise Pangolin"'],
              ["trusty", 'Ubuntu 14.04 LTS "Trusty Tahr"'],
              ["xenial", 'Ubuntu 16.04 LTS "Xenial Xerus"'],
              ["bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']
            ]
          }
        ]
      },
      general: {
        osInfo: {
          loading: false,
          loaded: true,
          data: {
            releases: [
              ["centos/centos66", "CentOS 6"],
              ["centos/centos70", "CentOS 7"],
              ["ubuntu/precise", "Ubuntu 12.04 LTS 'Precise Pangolin'"],
              ["ubuntu/trusty", "Ubuntu 14.04 LTS 'Trusty Tahr'"]
            ]
          }
        }
      }
    };
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <DeployForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("DeployFormFields").exists()).toBe(true);
  });
});
