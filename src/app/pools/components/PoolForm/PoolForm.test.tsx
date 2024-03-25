import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { PoolForm, Labels as PoolFormLabels } from "./PoolForm";

import urls from "@/app/base/urls";
import { resourcePoolActions } from "@/app/store/resourcepool";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore();

describe("PoolForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      resourcepool: factory.resourcePoolState({
        loaded: true,
        items: [
          factory.resourcePool({ name: "default", is_default: true }),
          factory.resourcePool({ name: "backup", is_default: false }),
        ],
      }),
    });
  });

  it("can render", () => {
    renderWithBrowserRouter(<PoolForm />, {
      route: "/",
      state,
    });

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

    expect(store.getActions()[0]).toEqual(resourcePoolActions.cleanup());
  });

  it("redirects when the resource pool is saved", () => {
    state.resourcepool.saved = true;
    renderWithBrowserRouter(<PoolForm />, {
      route: urls.pools.add,
      state,
      routePattern: `${urls.pools.index}/*`,
    });
    expect(window.location.pathname).toBe(urls.pools.index);
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

    expect(action).toEqual(
      resourcePoolActions.create({
        name: "test name",
        description: "test description",
      })
    );
  });

  it("can update a resource pool", async () => {
    const store = mockStore(state);
    const pool = factory.resourcePool({ id: 1 });

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
      resourcePoolActions.update({
        id: 1,
        name: "newName",
        description: "newDescription",
      })
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
