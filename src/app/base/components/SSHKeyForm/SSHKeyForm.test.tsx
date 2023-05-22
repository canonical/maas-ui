import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { SSHKeyForm } from "./SSHKeyForm";

import {
  sshKeyState as sshKeyStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import {
  userEvent,
  renderWithBrowserRouter,
  screen,
  submitFormikForm,
} from "testing/utils";

const mockStore = configureStore();

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
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyForm />, { store });
    expect(screen.getByTestId("ssh-key-form")).toBeInTheDocument();
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);
    const { unmount } = renderWithBrowserRouter(<SSHKeyForm />, { store });

    act(() => {
      unmount();
    });

    expect(
      store.getActions().some((action) => action.type === "sshkey/cleanup")
    ).toBe(true);
  });

  it("can upload an SSH key", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyForm />, { store });

    const sshKeyInput = screen.getByLabelText(/Public Key/);
    userEvent.type(sshKeyInput, "ssh-rsa...");

    const form = screen.getByTestId("ssh-key-form");
    act(() => submitFormikForm(form));

    expect(
      store.getActions().find((action) => action.type === "sshkey/create")
    ).toStrictEqual({
      type: "sshkey/create",
      payload: {
        params: {
          key: "ssh-rsa...",
        },
      },
      meta: {
        model: "sshkey",
        method: "create",
      },
    });
  });

  it("can import an SSH key", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyForm />, { store });

    const authIDInput = screen.getByLabelText("Auth ID");
    const protocolInput = screen.getByLabelText("Protocol");
    userEvent.type(authIDInput, "wallaroo");
    userEvent.type(protocolInput, "lp");

    const form = screen.getByTestId("ssh-key-form");
    act(() => submitFormikForm(form));

    expect(
      store.getActions().find((action) => action.type === "sshkey/import")
    ).toStrictEqual({
      type: "sshkey/import",
      payload: {
        params: {
          auth_id: "wallaroo",
          protocol: "lp",
        },
      },
      meta: {
        model: "sshkey",
        method: "import_keys",
      },
    });
  });

  it("adds a message when a SSH key is added", () => {
    state.sshkey.saved = true;
    const store = mockStore(state);
    renderWithBrowserRouter(<SSHKeyForm />, { store });

    const authIDInput = screen.getByLabelText("Auth ID");
    const protocolInput = screen.getByLabelText("Protocol");
    userEvent.type(authIDInput, "wallaroo");
    userEvent.type(protocolInput, "lp");

    const form = screen.getByTestId("ssh-key-form");
    submitFormikForm(form);

    const actions = store.getActions();

    expect(actions.some((action) => action.type === "sshkey/cleanup")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });
});
