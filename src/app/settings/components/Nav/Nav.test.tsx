import { mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings", key: "testKey" }]}
        initialIndex={0}
      >
        <CompatRouter>
          <Route path="/settings" render={() => <Nav />} />
        </CompatRouter>
      </MemoryRouter>
    );
    expect(wrapper.find("SideNav").exists()).toBe(true);
  });
});
