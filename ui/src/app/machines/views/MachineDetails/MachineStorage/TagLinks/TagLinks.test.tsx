import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import TagLinks from "./TagLinks";

describe("TagLinks", () => {
  it("shows links to filter machine list by storage tag", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
      >
        <TagLinks tags={["tag-1", "tag-2"]} />
      </MemoryRouter>
    );

    expect(wrapper.find("Link").length).toBe(2);
    expect(wrapper.find("Link").at(0).prop("to")).toBe(
      "/machines?storage_tags=%3Dtag-1"
    );
  });
});
