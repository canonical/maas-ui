import { mount, shallow } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { Main } from "./Main";

const mockStore = configureStore();

describe("Main", () => {
  it("renders", () => {
    const wrapper = shallow(
      <Main
        authLoading={false}
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
        fetchAuthUser={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("displays a message when logged out", () => {
    const wrapper = shallow(
      <Main authLoading={false} authUser={null} fetchAuthUser={jest.fn()} />
    );
    expect(wrapper.prop("title")).toBe(
      "You are not authenticated. Please log in to MAAS."
    );
  });

  it("displays a loading message", () => {
    const wrapper = shallow(
      <Main authLoading={true} authUser={null} fetchAuthUser={jest.fn()} />
    );
    expect(wrapper.prop("title")).toBe("Loading…");
  });

  it("fetches the user", () => {
    const fetchAuthUser = jest.fn();
    const state = {
      messages: { items: [] }
    };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <Main
          authLoading={false}
          authUser={null}
          fetchAuthUser={fetchAuthUser}
        />
      </Provider>
    );
    expect(fetchAuthUser.mock.calls.length).toBe(1);
  });

  it("displays a message if not an admin", () => {
    const wrapper = shallow(
      <Main
        authLoading={false}
        authUser={{
          email: "test@example.com",
          first_name: "",
          global_permissions: ["machine_create"],
          id: 1,
          is_superuser: false,
          last_name: "",
          sshkeys_count: 0,
          username: "admin"
        }}
        fetchAuthUser={jest.fn()}
      />
    );
    expect(wrapper.find("Section").prop("title")).toEqual(
      "You do not have permission to view this page."
    );
  });
});
