import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { resourcePool as resourcePoolFactory } from "testing/factories";
import { actions } from "app/store/resourcepool";
import { PoolForm } from "./PoolForm";

const mockStore = configureStore();

describe("PoolForm", () => {
  let state;
  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      resourcepool: {
        loaded: true,
        items: [
          resourcePoolFactory({ name: "default", is_default: true }),
          resourcePoolFactory({ name: "backup", is_default: false }),
        ],
      },
    };
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
    act(() => wrapper.find("FormikForm").at(0).props().onSubmit(pool, {}));

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
    act(() => {
      wrapper.find("Formik").props().onSubmit({
        name: "newName",
        description: "newDescription",
      });
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
    expect(actions.some((action) => action.type === "ADD_MESSAGE")).toBe(true);
  });
});
