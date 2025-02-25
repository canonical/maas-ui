import configureStore from "redux-mock-store";

import SSHKeyList from "./SSHKeyList";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import urls from "@/app/preferences/urls";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  within,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("SSHKeyList", () => {
  let state: RootState;
  const setSidePanelContent = vi.fn();

  beforeEach(() => {
    vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
      setSidePanelContent,
      sidePanelContent: null,
      setSidePanelSize: vi.fn(),
      sidePanelSize: "regular",
    });
    state = factory.rootState({
      sshkey: factory.sshKeyState({
        loading: false,
        loaded: true,
        items: [
          factory.sshKey({
            id: 1,
            key: "ssh-rsa aabb",
            keysource: { protocol: "lp", auth_id: "koalaparty" },
          }),
          factory.sshKey({
            id: 2,
            key: "ssh-rsa ccdd",
            keysource: { protocol: "gh", auth_id: "koalaparty" },
          }),
          factory.sshKey({
            id: 3,
            key: "ssh-rsa eeff",
            keysource: { protocol: "lp", auth_id: "maaate" },
          }),
          factory.sshKey({
            id: 4,
            key: "ssh-rsa gghh",
            keysource: { protocol: "gh", auth_id: "koalaparty" },
          }),
          factory.sshKey({ id: 5, key: "ssh-rsa gghh" }),
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
    expect(within(rows[0]).getByText("ssh-rsa aabb")).toBeInTheDocument();

    expect(within(rows[1]).getByText("ssh-rsa ccdd")).toBeInTheDocument();
    expect(within(rows[1]).getByText("ssh-rsa gghh")).toBeInTheDocument();

    expect(within(rows[2]).getByText("ssh-rsa eeff")).toBeInTheDocument();
  });

  it("full SSH key value is displayed", () => {
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      state,
    });
    const keyValue = "ssh-rsa eeff";
    // verifies that the full value is exposed in the title attribute
    expect(screen.getByText(keyValue)).toHaveAccessibleName(keyValue);
  });

  it("can display uploaded keys", () => {
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      state,
    });
    const uploadedKeyRow = screen.getAllByTestId("sshkey-row")[3];

    expect(within(uploadedKeyRow).getByText("Upload")).toBeInTheDocument();
    expect(
      within(uploadedKeyRow).getByText("ssh-rsa gghh")
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
      within(importedKeyRow).getByText("ssh-rsa aabb")
    ).toBeInTheDocument();
  });

  it("can trigger a delete confirmation form", async () => {
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      state,
    });
    const row = screen.getAllByTestId("sshkey-row")[0];
    expect(row).not.toHaveClass("is-active");
    // Click on the delete button:
    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    expect(window.location.pathname).toBe(urls.sshKeys.delete);
  });

  it("displays a message if there are no SSH keys", () => {
    state.sshkey.items = [];
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
      store,
    });

    expect(screen.getByText("No SSH keys available.")).toBeInTheDocument();
  });
});
