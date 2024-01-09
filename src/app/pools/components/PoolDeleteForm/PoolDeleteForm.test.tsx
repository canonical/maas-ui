import PoolDeleteForm from "./PoolDeleteForm";

import { renderWithBrowserRouter, screen } from "testing/utils";

it("renders", () => {
  renderWithBrowserRouter(<PoolDeleteForm id={1} />);

  expect(
    screen.getByRole("form", { name: /Confirm pool deletion/i })
  ).toBeInTheDocument();
});
