import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom";

import { AddSSHKey, Label as AddSSHKeyLabels } from "./AddSSHKey";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithMockStore } from "@/testing/utils";

describe("AddSSHKey", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      sshkey: factory.sshKeyState({
        loading: false,
        loaded: true,
        items: [],
      }),
    });
  });

  it("can render", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={["/"]}>
        <CompatRouter>
          <AddSSHKey />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(
      screen.getByRole("form", { name: AddSSHKeyLabels.FormLabel })
    ).toBeInTheDocument();
  });

  it("redirects when the SSH key is saved", () => {
    state.sshkey.saved = true;
    const history = createMemoryHistory({ initialEntries: ["/"] });
    renderWithMockStore(
      <Router history={history}>
        <CompatRouter>
          <AddSSHKey />
        </CompatRouter>
      </Router>,
      { state }
    );
    expect(history.location.pathname).toBe(urls.preferences.sshKeys.index);
  });
});
