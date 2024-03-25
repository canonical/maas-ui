import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";

import TagLinks from "./TagLinks";

import { render, screen } from "@/testing/utils";

describe("TagLinks", () => {
  it("displays tag links", () => {
    render(
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

    expect(screen.getByRole("link", { name: "tag-1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "tag-2" })).toBeInTheDocument();
  });
});
