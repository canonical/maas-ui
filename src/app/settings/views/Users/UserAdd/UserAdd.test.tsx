import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import { UserAdd } from "./UserAdd";

import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  statusState as statusStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("UserAdd", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      status: statusStateFactory({
        externalAuthURL: null,
      }),
    });
  });

  it("can render", () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings/users/add", key: "testKey" }]}
      >
        <CompatRouter>
          <UserAdd />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(
      screen.getByRole("heading", { name: "Add user" })
    ).toBeInTheDocument();
  });
});
