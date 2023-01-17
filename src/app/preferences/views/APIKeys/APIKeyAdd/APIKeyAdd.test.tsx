import { Label as APIKeyFormLabels } from "../APIKeyForm/APIKeyForm";

import { APIKeyAdd } from "./APIKeyAdd";

import type { RootState } from "app/store/root/types";
import { screen, renderWithBrowserRouter } from "testing/utils";

describe("APIKeyAdd", () => {
  let state: RootState;

  it("can render", () => {
    renderWithBrowserRouter(<APIKeyAdd />, {
      route: "/",
      state,
    });
    expect(
      screen.getByRole("form", { name: APIKeyFormLabels.AddFormLabel })
    ).toBeInTheDocument();
  });
});
