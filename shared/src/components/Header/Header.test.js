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
        completedIntro={true}
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
      .findWhere(n => n.name() === "a" && n.text() === "Log out")
      .last()
      .simulate("click", { preventDefault: jest.fn() });
    expect(logout).toHaveBeenCalled();
  });

  it("can show the intro flow state", () => {
    const wrapper = shallow(
      <Header
        authUser={{
          is_superuser: true,
          username: "koala"
        }}
        basename="/MAAS"
        completedIntro={false}
        location={{
          pathname: "/"
        }}
        logout={jest.fn()}
      />
    );
    expect(
      wrapper.findWhere(n => n.name() === "a" && n.text() === "Skip").exists()
    ).toBe(true);
    expect(
      wrapper
        .find(".p-navigation__links")
        .at(0)
        .props().children
    ).toBe(false);
  });

  it("can highlight a new URL", () => {
    const wrapper = shallow(
      <Header
        authUser={{
          is_superuser: true,
          username: "koala"
        }}
        basename="/MAAS"
        completedIntro={true}
        location={{
          pathname: "/settings"
        }}
        logout={jest.fn()}
      />
    );
    const selected = wrapper.find(".p-navigation__link.is-selected");
    expect(selected.exists()).toBe(true);
    expect(selected.text()).toEqual("Settings");
  });

  it("can highlight a legacy URL", () => {
    const wrapper = shallow(
      <Header
        authUser={{
          is_superuser: true,
          username: "koala"
        }}
        basename="/MAAS"
        completedIntro={true}
        location={{
          hash: "#/devices",
          pathname: "/MAAS/"
        }}
        logout={jest.fn()}
      />
    );
    const selected = wrapper.find(".p-navigation__link.is-selected");
    expect(selected.exists()).toBe(true);
    expect(selected.text()).toEqual("Devices");
  });
});
