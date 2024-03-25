import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";

import { UserAdd } from "./UserAdd";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithMockStore } from "@/testing/utils";

describe("UserAdd", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      status: factory.statusState({
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
    expect(screen.getByRole("form", { name: "Add user" })).toBeInTheDocument();
  });
});
