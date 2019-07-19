import { shallow } from "enzyme";
import React from "react";

import { Header } from "./Header";

describe("Header", () => {
  let maasConfig;

  beforeAll(() => {
    maasConfig = window.MAAS_config;
  });

  beforeEach(() => {
    window.MAAS_config = {
      ui: {
        maas_url: "http://maas.local:5240/MAAS"
      }
    };
  });

  afterEach(() => {
    jest.resetModules();
  });

  afterAll(() => {
    window.MAAS_config = maasConfig;
  });

  it("renders", () => {
    const wrapper = shallow(
      <Header
        authUser={{
          email: "test@example.com",
          first_name: "",
          global_permissions: ["machine_create"],
          id: 1,
          is_superuser: true,
          last_name: "",
          sshkeys_count: 0,
          username: "admin"
        }}
        location={{ pathname: "/", hash: "", search: "" }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
