import configureStore from "redux-mock-store";

import SSHKeyList from "./SSHKeyList";

import {
  sshKey as sshKeyFactory,
  sshKeyState as sshKeyStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("SSHKeyList", () => {
  let state;

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
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      store,
    });
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("can display errors", () => {
    state.sshkey.errors = "Unable to list SSH keys.";
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      store,
    });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Error:Unable to list SSH keys."
    );
  });

  it("can group keys", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      store,
    });
    expect(screen.getAllByTestId("sshkey-row")).toHaveLength(
      state.sshkey.items.length - 1
    );
    expect(
      screen
        .getAllByTestId("sshkey-row")[1]
        .querySelectorAll(".p-table-sub-cols__item").length
    ).toBe(2);
  });

  it("can display uploaded keys", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      store,
    });
    const cols = screen
      .getAllByRole("columnheader")[2]
      .parentElement.querySelectorAll("td");
    expect(cols[0]).toHaveTextContent("Upload");
    expect(cols[1]).toHaveTextContent("");
    expect(cols[2]).toHaveTextContent(/ssh-rsa gghh/i);
  });

  it("can display imported keys", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      store,
    });
    const cols = screen
      .getAllByRole("columnheader")[2]
      .parentElement.querySelectorAll("td");
    expect(cols[0]).toHaveTextContent("Launchpad");
    expect(cols[1]).toHaveTextContent("koalaparty");
    expect(cols[2]).toHaveTextContent(/ssh-rsa aabb/i);
  });

  it("can show a delete confirmation", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      store,
    });
    let row = screen.getAllByTestId("sshkey-row")[0];
    expect(row).not.toHaveClass("is-active");
    // Click on the delete button:
    screen.getAllByText("Delete")[0].click();
    row = screen.getAllByTestId("sshkey-row")[0];
    expect(row).toHaveClass("is-active");
  });

  it("can delete a SSH key", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      store,
    });
    // Click on the delete button:
    screen.getAllByText("Delete")[0].click();
    // Click on the delete confirm button
    screen.getByTestId("action-confirm").click();
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

  it("can delete a group of SSH keys", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      store,
    });
    // Click on the delete button:
    screen.getAllByText("Delete")[1].click();
    // Click on the delete confirm button
    screen.getByTestId("action-confirm").click();
    expect(
      store.getActions().filter((action) => action.type === "sshkey/delete")
        .length
    ).toEqual(2);
  });

  it("can add a message when a SSH key is deleted", () => {
    state.sshkey.saved = true;
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      store,
    });
    // Click on the delete button:
    screen.getAllByText("Delete")[0].click();
    // Simulate clicking on the delete confirm button.
    screen.getByTestId("action-confirm").click();
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "sshkey/cleanup")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });
});
