import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import TagLinks from "./TagLinks";

describe("TagLinks", () => {
  it("renders", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
      >
        <CompatRouter>
          <TagLinks
            getLinkURL={(tag) => `www.tags.com/${tag}`}
            tags={["tag-1", "tag-2"]}
          />
        </CompatRouter>
      </MemoryRouter>
    );

    expect(wrapper.find("TagLinks")).toMatchSnapshot();
  });
});
