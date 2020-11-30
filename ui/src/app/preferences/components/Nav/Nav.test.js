import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";

import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: "/prefs", key: "testKey" }]}
        initialIndex={0}
      >
        <Route component={(props) => <Nav {...props} />} path="/prefs" />
      </MemoryRouter>
    );
    expect(wrapper.find("SideNav").exists()).toBe(true);
  });
});
