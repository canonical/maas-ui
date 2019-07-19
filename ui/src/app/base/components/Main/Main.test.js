import { mount, shallow } from "enzyme";
import React from "react";

import { Main } from "./Main";

describe("Main", () => {
  it("renders", () => {
    const wrapper = shallow(
      <Main
        authUser={{
          loading: false,
          user: {
            email: "test@example.com",
            first_name: "",
            global_permissions: ["machine_create"],
            id: 1,
            is_superuser: true,
            last_name: "",
            sshkeys_count: 0,
            username: "admin"
          }
        }}
        fetchAuthUser={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("displays a message when logged out", () => {
    const wrapper = shallow(
      <Main
        authUser={{ loading: false, user: null }}
        fetchAuthUser={jest.fn()}
      />
    );
    expect(wrapper.prop("title")).toBe(
      "You are not authenticated. Please log in to MAAS."
    );
  });

  it("displays a loading message", () => {
    const wrapper = shallow(
      <Main
        authUser={{ loading: true, user: null }}
        fetchAuthUser={jest.fn()}
      />
    );
    expect(wrapper.prop("title")).toBe("Loading…");
  });

  it("fetches the user", () => {
    const fetchAuthUser = jest.fn();
    mount(
      <Main
        authUser={{ loading: true, user: null }}
        fetchAuthUser={fetchAuthUser}
      />
    );
    expect(fetchAuthUser.mock.calls.length).toBe(1);
  });
});
