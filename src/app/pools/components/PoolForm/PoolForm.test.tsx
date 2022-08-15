import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { MemoryRouter, Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { PoolForm, Labels as PoolFormLabels } from "./PoolForm";

import urls from "app/base/urls";
import { actions } from "app/store/resourcepool";
import type { RootState } from "app/store/root/types";
import {
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

const mockStore = configureStore();

describe("PoolForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      resourcepool: resourcePoolStateFactory({
        loaded: true,
        items: [
          resourcePoolFactory({ name: "default", is_default: true }),
          resourcePoolFactory({ name: "backup", is_default: false }),
        ],
      }),
    });
  });

  it("can render", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={["/"]}>
        <CompatRouter>
          <PoolForm />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(screen.getByRole("form", { name: PoolFormLabels.AddPoolTitle }));
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);

    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <PoolForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    unmount();

    expect(store.getActions()[0]).toEqual(actions.cleanup());
  });

  it("redirects when the resource pool is saved", () => {
    state.resourcepool.saved = true;
    const history = createMemoryHistory({
      initialEntries: ["/"],
    });
    renderWithMockStore(
      <Router history={history}>
        <CompatRouter>
          <PoolForm />
        </CompatRouter>
      </Router>,
      { state }
    );
    expect(history.location.pathname).toBe(urls.pools.index);
  });

  it("can create a resource pool", async () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/pools/add"]}>
          <CompatRouter>
            <PoolForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: PoolFormLabels.PoolName }),
      "test name"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: PoolFormLabels.PoolDescription }),
      "test description"
    );

    await userEvent.click(
      screen.getByRole("button", { name: PoolFormLabels.SubmitLabel })
    );

    const action = store
      .getActions()
      .find((action) => action.type === "resourcepool/create");

    expect(action).toEqual({
      type: "resourcepool/create",
      payload: {
        params: {
          name: "test name",
          description: "test description",
        },
      },
      meta: {
        model: "resourcepool",
        method: "create",
      },
    });
  });

  it("can update a resource pool", async () => {
    const store = mockStore(state);
    const pool = resourcePoolFactory({ id: 1 });

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/pools/", key: "testKey" }]}
        >
          <CompatRouter>
            <PoolForm pool={pool} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const name_textbox = screen.getByRole("textbox", {
      name: PoolFormLabels.PoolName,
    });
    const description_textbox = screen.getByRole("textbox", {
      name: PoolFormLabels.PoolDescription,
    });

    await userEvent.clear(name_textbox);
    await userEvent.clear(description_textbox);

    await userEvent.type(name_textbox, "newName");
    await userEvent.type(description_textbox, "newDescription");

    await userEvent.click(
      screen.getByRole("button", { name: PoolFormLabels.SubmitLabel })
    );

    const action = store
      .getActions()
      .find((action) => action.type === "resourcepool/update");

    expect(action).toEqual(
      actions.update({ id: 1, name: "newName", description: "newDescription" })
    );
  });

  it("adds a message when a resource pool is added", () => {
    state.resourcepool.saved = true;
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <PoolForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();

    expect(
      actions.some((action) => action.type === "resourcepool/cleanup")
    ).toBe(true);
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });
});
