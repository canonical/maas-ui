import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { PoolForm } from "./PoolForm";

import { actions } from "app/store/resourcepool";
import type { RootState } from "app/store/root/types";
import {
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

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
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <PoolForm />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("PoolForm").exists()).toBe(true);
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <PoolForm />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.unmount();
    });

    expect(store.getActions()[0]).toEqual(actions.cleanup());
  });

  it("redirects when the resource pool is saved", () => {
    state.resourcepool.saved = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/pool/add"]}>
          <PoolForm />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("can create a resource pool", () => {
    const store = mockStore(state);
    const pool = resourcePoolFactory();

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/pools/add"]}>
          <PoolForm />
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(wrapper, pool);

    expect(store.getActions()[1]).toEqual(actions.create(pool));
  });

  it("can update a resource pool", () => {
    const store = mockStore(state);
    const pool = resourcePoolFactory({ id: 1 });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/pools/", key: "testKey" }]}
        >
          <PoolForm pool={pool} />
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(wrapper, {
      name: "newName",
      description: "newDescription",
    });
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

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <PoolForm />
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
