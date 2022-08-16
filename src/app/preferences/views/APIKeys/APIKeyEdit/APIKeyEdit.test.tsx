import { screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";

import { Label as APIKeyFormLabels } from "../APIKeyForm/APIKeyForm";

import { APIKeyEdit } from "./APIKeyEdit";

import type { RootState } from "app/store/root/types";
import {
  token as tokenFactory,
  tokenState as tokenStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("APIKeyEdit", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      token: tokenStateFactory({
        items: [
          tokenFactory({
            id: 1,
            key: "ssh-rsa aabb",
            consumer: { key: "abc", name: "Name" },
          }),
        ],
      }),
    });
  });

  it("displays a loading component if loading", () => {
    state.token.loading = true;
    state.token.loaded = false;
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[
          { pathname: "/account/prefs/api-keys/1", key: "testKey" },
        ]}
      >
        <CompatRouter>
          <APIKeyEdit />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles api key not found", () => {
    state.token.items = [];
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[
          { pathname: "/account/prefs/api-keys/1", key: "testKey" },
        ]}
      >
        <CompatRouter>
          <APIKeyEdit />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByText("API key not found")).toBeInTheDocument();
  });

  it("can display an api key edit form", () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[
          { pathname: "/account/prefs/api-keys/1/edit", key: "testKey" },
        ]}
      >
        <CompatRouter>
          <Routes>
            <Route
              element={<APIKeyEdit />}
              path="/account/prefs/api-keys/:id/edit"
            />
          </Routes>
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    const form = screen.getByRole("form", { name: APIKeyFormLabels.EditTitle });
    expect(form).toBeInTheDocument();
    expect(
      within(form).getByRole("textbox", { name: "API key name" })
    ).toHaveValue(state.token.items[0].consumer.name);
  });
});
