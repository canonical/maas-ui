import { mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: "/prefs", key: "testKey" }]}
        initialIndex={0}
      >
        <CompatRouter>
          <Route render={() => <Nav />} path="/prefs" />
        </CompatRouter>
      </MemoryRouter>
    );
    expect(wrapper.find("SideNav").exists()).toBe(true);
  });
});
