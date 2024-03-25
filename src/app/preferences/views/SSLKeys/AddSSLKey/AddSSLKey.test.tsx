import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { MemoryRouter, Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { AddSSLKey, Label as AddSSLKeyLabels } from "./AddSSLKey";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  renderWithMockStore,
} from "@/testing/utils";

const mockStore = configureStore();

describe("AddSSLKey", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      sslkey: factory.sslKeyState({
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
          <AddSSLKey />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByRole("form", { name: AddSSLKeyLabels.FormLabel }));
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);
    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <AddSSLKey />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    unmount();

    expect(
      store.getActions().some((action) => action.type === "sslkey/cleanup")
    ).toBe(true);
  });

  it("redirects when the SSL key is saved", () => {
    state.sslkey.saved = true;
    const history = createMemoryHistory({ initialEntries: ["/"] });
    renderWithMockStore(
      <Router history={history}>
        <CompatRouter>
          <AddSSLKey />
        </CompatRouter>
      </Router>,
      { state }
    );
    expect(history.location.pathname).toBe(urls.preferences.sslKeys.index);
  });

  it("can create a SSL key", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <AddSSLKey />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: AddSSLKeyLabels.KeyField }),
      "--- begin cert ---..."
    );

    await userEvent.click(
      screen.getByRole("button", { name: AddSSLKeyLabels.SubmitLabel })
    );

    expect(
      store.getActions().find((action) => action.type === "sslkey/create")
    ).toStrictEqual({
      type: "sslkey/create",
      payload: {
        params: {
          key: "--- begin cert ---...",
        },
      },
      meta: {
        model: "sslkey",
        method: "create",
      },
    });
  });

  it("adds a message when a SSL key is added", () => {
    state.sslkey.saved = true;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <AddSSLKey />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "sslkey/cleanup")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });
});
