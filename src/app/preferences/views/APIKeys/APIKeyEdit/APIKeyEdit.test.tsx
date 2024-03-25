import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom";

import { Label as APIKeyFormLabels } from "../APIKeyForm/APIKeyForm";

import { APIKeyEdit, Label as APIKeyEditLabels } from "./APIKeyEdit";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, within, renderWithMockStore } from "@/testing/utils";

describe("APIKeyEdit", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      token: factory.tokenState({
        items: [
          factory.token({
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
    expect(screen.getByText(APIKeyEditLabels.NotFound)).toBeInTheDocument();
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
    const form = screen.getByRole("form", {
      name: APIKeyFormLabels.EditFormLabel,
    });
    expect(form).toBeInTheDocument();
    expect(
      within(form).getByRole("textbox", {
        name: APIKeyFormLabels.EditNameLabel,
      })
    ).toHaveValue(state.token.items[0].consumer.name);
  });
});
