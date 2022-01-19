import { mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";

import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: "/prefs", key: "testKey" }]}
        initialIndex={0}
      >
        <Route render={() => <Nav />} path="/prefs" />
      </MemoryRouter>
    );
    expect(wrapper.find("SideNav").exists()).toBe(true);
  });
});
