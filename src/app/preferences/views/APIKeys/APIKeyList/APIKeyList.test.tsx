import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";

import APIKeyList, { Label as APIKeyListLabels } from "./APIKeyList";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  screen,
  renderWithMockStore,
  renderWithBrowserRouter,
} from "@/testing/utils";

describe("APIKeyList", () => {
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
          factory.token({
            id: 2,
            key: "ssh-rsa ccdd",
            consumer: { key: "abc", name: "Name" },
          }),
        ],
      }),
    });
  });

  it("can render the table", () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[
          { pathname: "/account/prefs/api-keys", key: "testKey" },
        ]}
      >
        <CompatRouter>
          <APIKeyList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(
      screen.getByRole("grid", { name: APIKeyListLabels.Title })
    ).toBeInTheDocument();
  });

  it("can display an empty state message", () => {
    state.token.items = [];
    renderWithBrowserRouter(<APIKeyList />, {
      state,
      route: "/account/prefs/api-keys",
    });

    expect(screen.getByText(APIKeyListLabels.EmptyList)).toBeInTheDocument();
  });
});
