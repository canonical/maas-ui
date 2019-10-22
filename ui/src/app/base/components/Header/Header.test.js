import { shallow } from "enzyme";
import React from "react";

import { Header } from "./Header";

describe("Header", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("renders", () => {
    const wrapper = shallow(
      <Header
        authUser={{
          is_superuser: true,
          username: "koala"
        }}
        basename="/MAAS"
        location={{
          pathname: "/"
        }}
        logout={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("can handle a logged out user", () => {
    const wrapper = shallow(
      <Header
        authUser={null}
        basename="/MAAS"
        location={{
          pathname: "/"
        }}
        logout={jest.fn()}
      />
    );
    expect(wrapper.find("nav").exists()).toBe(false);
  });

  it("can handle logging out", () => {
    const logout = jest.fn();
    const wrapper = shallow(
      <Header
        authUser={{
          is_superuser: true,
          username: "koala"
        }}
        basename="/MAAS"
        location={{
          pathname: "/"
        }}
        logout={logout}
      />
    );
    wrapper
      .findWhere(n => n.name() === "a" && n.text() === "Logout")
      .last()
      .simulate("click", { preventDefault: jest.fn() });
    expect(logout).toHaveBeenCalled();
  });
});
