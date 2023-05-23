import configureStore from "redux-mock-store";

import { SSHKeyForm } from "./SSHKeyForm";

import type { RootState } from "app/store/root/types";
import {
  sshKeyState as sshKeyStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { userEvent, renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("SSHKeyForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      sshkey: sshKeyStateFactory({
        loading: false,
        loaded: true,
        items: [],
      }),
    });
  });

  it("can render", () => {
    renderWithBrowserRouter(<SSHKeyForm />, { state });
    expect(
      screen.getByRole("combobox", { name: "Source" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Launchpad" })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "GitHub" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Upload" })).toBeInTheDocument();
    expect(screen.getByText("About SSH keys")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Import SSH key" })
    ).toBeInTheDocument();
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);
    const { unmount } = renderWithBrowserRouter(<SSHKeyForm />, { store });

    unmount();

    expect(
      store.getActions().some((action) => action.type === "sshkey/cleanup")
    ).toBe(true);
  });

  it("can upload an SSH key", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyForm />, { store });

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Source" }),
      "upload"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Public key" }),
      "ssh-rsa..."
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Import SSH key" })
    );

    expect(
      store.getActions().find((action) => action.type === "sshkey/create")
    ).toStrictEqual({
      type: "sshkey/create",
      payload: {
        params: {
          auth_id: "",
          key: "ssh-rsa...",
          protocol: "upload",
        },
      },
      meta: {
        model: "sshkey",
        method: "create",
      },
    });
  });

  it("can import an SSH key", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyForm />, { store });

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Source" }),
      "lp"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Launchpad ID" }),
      "wallaroo"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Import SSH key" })
    );

    expect(
      store.getActions().find((action) => action.type === "sshkey/import")
    ).toStrictEqual({
      type: "sshkey/import",
      payload: {
        params: {
          auth_id: "wallaroo",
          key: "",
          protocol: "lp",
        },
      },
      meta: {
        model: "sshkey",
        method: "import_keys",
      },
    });
  });

  it("adds a message when a SSH key is added", async () => {
    state.sshkey.saved = true;
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyForm />, { store });

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Source" }),
      "lp"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Launchpad ID" }),
      "wallaroo"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Import SSH key" })
    );

    const actions = store.getActions();

    expect(actions.some((action) => action.type === "sshkey/cleanup")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });
});
