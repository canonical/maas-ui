import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import { Label as APIKeyFormLabels } from "../APIKeyForm/APIKeyForm";

import { APIKeyAdd } from "./APIKeyAdd";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("APIKeyAdd", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory();
  });

  it("can render", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={["/"]}>
        <CompatRouter>
          <APIKeyAdd />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(
      screen.getByRole("form", { name: APIKeyFormLabels.AddFormLabel })
    ).toBeInTheDocument();
  });
});
