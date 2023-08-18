import SearchBox from "./SearchBox";

import { render, screen, userEvent } from "testing/utils";

it("focuses on the search box when pressing '/' key", async () => {
  render(<SearchBox />);
  const searchBox = screen.getByRole("searchbox");
  expect(searchBox).not.toHaveFocus();
  await userEvent.type(document.body, "/");
  expect(searchBox).toHaveFocus();
});
