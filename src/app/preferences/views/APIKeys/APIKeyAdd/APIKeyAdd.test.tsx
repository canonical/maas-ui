import { screen } from "@testing-library/react";

import { Label as APIKeyFormLabels } from "../APIKeyForm/APIKeyForm";

import { APIKeyAdd } from "./APIKeyAdd";

import type { RootState } from "app/store/root/types";
import { renderWithBrowserRouter } from "testing/utils";

describe("APIKeyAdd", () => {
  let state: RootState;

  it("can render", () => {
    renderWithBrowserRouter(<APIKeyAdd />, {
      route: "/",
      wrapperProps: { state },
    });
    expect(
      screen.getByRole("form", { name: APIKeyFormLabels.AddFormLabel })
    ).toBeInTheDocument();
  });
});
