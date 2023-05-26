import configureStore from "redux-mock-store";

import SSHKeyList from "./SSHKeyList";

import type { RootState } from "app/store/root/types";
import {
  sshKey as sshKeyFactory,
  sshKeyState as sshKeyStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  within,
} from "testing/utils";

const mockStore = configureStore<RootState>();

describe("SSHKeyList", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      sshkey: sshKeyStateFactory({
        loading: false,
        loaded: true,
        items: [
          sshKeyFactory({
            id: 1,
            key: "ssh-rsa aabb",
            keysource: { protocol: "lp", auth_id: "koalaparty" },
          }),
          sshKeyFactory({
            id: 2,
            key: "ssh-rsa ccdd",
            keysource: { protocol: "gh", auth_id: "koalaparty" },
          }),
          sshKeyFactory({
            id: 3,
            key: "ssh-rsa eeff",
            keysource: { protocol: "lp", auth_id: "maaate" },
          }),
          sshKeyFactory({
            id: 4,
            key: "ssh-rsa gghh",
            keysource: { protocol: "gh", auth_id: "koalaparty" },
          }),
          sshKeyFactory({ id: 5, key: "ssh-rsa gghh" }),
        ],
      }),
    });
  });

  it("displays a loading component if SSH keys are loading", () => {
    state.sshkey.loading = true;
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      state,
    });
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("can display errors", () => {
    state.sshkey.errors = "Unable to list SSH keys.";
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      state,
    });
    expect(screen.getByText("Unable to list SSH keys.")).toBeInTheDocument();
  });

  it("can group keys", () => {
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      state,
    });

    const rows = screen.getAllByTestId("sshkey-row");

    // Two of the keys should be grouped together.
    expect(rows).toHaveLength(state.sshkey.items.length - 1);
    // The grouped keys should be displayed in sub cols.
    expect(within(rows[0]).getByText("ssh-rsa aabb...")).toBeInTheDocument();

    expect(within(rows[1]).getByText("ssh-rsa ccdd...")).toBeInTheDocument();
    expect(within(rows[1]).getByText("ssh-rsa gghh...")).toBeInTheDocument();

    expect(within(rows[2]).getByText("ssh-rsa eeff...")).toBeInTheDocument();
  });

  it("can display uploaded keys", () => {
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      state,
    });
    const uploadedKeyRow = screen.getAllByTestId("sshkey-row")[3];

    expect(within(uploadedKeyRow).getByText("Upload")).toBeInTheDocument();
    expect(
      within(uploadedKeyRow).getByText("ssh-rsa gghh...")
    ).toBeInTheDocument();
  });

  it("can display imported keys", () => {
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      state,
    });
    const importedKeyRow = screen.getAllByTestId("sshkey-row")[0];

    expect(within(importedKeyRow).getByText("Launchpad")).toBeInTheDocument();
    expect(within(importedKeyRow).getByText("koalaparty")).toBeInTheDocument();
    expect(
      within(importedKeyRow).getByText("ssh-rsa aabb...")
    ).toBeInTheDocument();
  });

  it("can show a delete confirmation", async () => {
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      state,
    });
    let row = screen.getAllByTestId("sshkey-row")[0];
    expect(row).not.toHaveClass("is-active");
    // Click on the delete button:
    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    row = screen.getAllByTestId("sshkey-row")[0];
    expect(row).toHaveClass("is-active");
    expect(
      screen.getByText("Are you sure you want to delete this SSH key?")
    ).toBeInTheDocument();
  });

  it("can delete a SSH key", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      store,
    });
    // Click on the delete button:
    await userEvent.click(screen.getAllByText("Delete")[0]);
    // Click on the delete confirm button
    await userEvent.click(screen.getByTestId("action-confirm"));
    expect(
      store.getActions().find((action) => action.type === "sshkey/delete")
    ).toEqual({
      type: "sshkey/delete",
      payload: {
        params: {
          id: 1,
        },
      },
      meta: {
        model: "sshkey",
        method: "delete",
      },
    });
  });

  it("can delete a group of SSH keys", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      store,
    });
    // Click on the delete button:
    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[1])
    // Click on the delete confirm button
    await userEvent.click(screen.getByTestId("action-confirm"));
    expect(
      store.getActions().filter((action) => action.type === "sshkey/delete")
        .length
    ).toEqual(2);
  });

  it("can add a message when a SSH key is deleted", async () => {
    state.sshkey.saved = true;
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      store,
    });
    // Click on the delete button:
    await userEvent.click(screen.getAllByText("Delete")[0]);
    // Simulate clicking on the delete confirm button.
    await userEvent.click(screen.getByTestId("action-confirm"));
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "sshkey/cleanup")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });
});
