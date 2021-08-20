import { mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";

import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings", key: "testKey" }]}
        initialIndex={0}
      >
        <Route component={() => <Nav />} path="/settings" />
      </MemoryRouter>
    );
    expect(wrapper.find("SideNav").exists()).toBe(true);
  });
});
