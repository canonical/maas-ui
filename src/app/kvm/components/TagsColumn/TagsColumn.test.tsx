import { render, screen } from "@testing-library/react";

import TagsColumn from "./TagsColumn";

describe("TagsColumn", () => {
  it("displays the pod's tags", () => {
    const tags = ["tag1", "tag2"];
    render(<TagsColumn tags={tags} />);
    expect(screen.getByTestId("pod-tags")).toHaveTextContent("tag1, tag2");
  });
});
