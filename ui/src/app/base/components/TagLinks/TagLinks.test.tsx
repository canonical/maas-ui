import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import TagLinks from "./TagLinks";

describe("TagLinks", () => {
  it("renders", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
      >
        <TagLinks
          getLinkURL={(tag) => `www.tags.com/${tag}`}
          tags={["tag-1", "tag-2"]}
        />
      </MemoryRouter>
    );

    expect(wrapper.find("TagLinks")).toMatchSnapshot();
  });
});
