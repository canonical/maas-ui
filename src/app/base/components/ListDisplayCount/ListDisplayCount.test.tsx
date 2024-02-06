import ListDisplayCount from "./ListDisplayCount";

import { render, screen } from "@/testing/utils";

it("shows the true number of items on a page if it is under the maximum items per page limit.", () => {
  render(
    <ListDisplayCount count={135} currentPage={3} pageSize={50} type="tag" />
  );

  expect(screen.getByText("Showing 35 out of 135 tags")).toBeInTheDocument();
});

it("shows the maximum number of items per page if that limit is reached", () => {
  render(
    <ListDisplayCount
      count={135}
      currentPage={2}
      pageSize={50}
      type="machine"
    />
  );

  expect(
    screen.getByText("Showing 50 out of 135 machines")
  ).toBeInTheDocument();
});
