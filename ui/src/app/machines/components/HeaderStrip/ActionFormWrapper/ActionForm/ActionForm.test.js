import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import ActionForm from "./ActionForm";

const mockStore = configureStore();

describe("ActionForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          {
            system_id: "abc123",
          },
        ],
        selected: [],
      },
    };
  });

  it("renders", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "commission" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("ActionForm")).toMatchSnapshot();
  });

  it("can unset the selected action", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "a", actions: ["commission"] }];
    state.machine.selected = ["a"];
    const store = mockStore(state);
    const setSelectedAction = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "commission" }}
            setSelectedAction={setSelectedAction}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="cancel-action"] button').simulate("click");

    expect(setSelectedAction).toHaveBeenCalledWith(null);
  });

  it("displays a negative submit button if selected action is delete", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["delete"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const setSelectedAction = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "delete" }}
            setSelectedAction={setSelectedAction}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("ActionButton").props().appearance).toBe("negative");
  });

  it("can dispatch abort action", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["abort"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "abort" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(store.getActions()).toStrictEqual([
      {
        type: "ABORT_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "abort",
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch acquire action", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["acquire"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "acquire" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(store.getActions()).toStrictEqual([
      {
        type: "ACQUIRE_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "acquire",
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch delete action", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["delete"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "delete" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(store.getActions()).toStrictEqual([
      {
        type: "DELETE_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "delete",
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch exit rescue mode action", () => {
    const state = { ...initialState };
    state.machine.items = [
      { system_id: "abc123", actions: ["exit-rescue-mode"] },
    ];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "exit-rescue-mode" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(store.getActions()).toStrictEqual([
      {
        type: "MACHINE_EXIT_RESCUE_MODE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "exit-rescue-mode",
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch lock action", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["lock"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "lock" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(store.getActions()).toStrictEqual([
      {
        type: "LOCK_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "lock",
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch mark broken action", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["mark-broken"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "mark-broken" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(store.getActions()).toStrictEqual([
      {
        type: "MARK_MACHINE_BROKEN",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "mark-broken",
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch mark fixed action", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["mark-fixed"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "mark-fixed" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(store.getActions()).toStrictEqual([
      {
        type: "MARK_MACHINE_FIXED",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "mark-fixed",
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch power off action", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["off"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "off" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(store.getActions()).toStrictEqual([
      {
        type: "TURN_MACHINE_OFF",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "off",
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch power on action", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["on"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "on" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(store.getActions()).toStrictEqual([
      {
        type: "TURN_MACHINE_ON",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "on",
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch release action", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["release"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "release" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(store.getActions()).toStrictEqual([
      {
        type: "RELEASE_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "release",
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch unlock action", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["unlock"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "unlock" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(store.getActions()).toStrictEqual([
      {
        type: "UNLOCK_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "unlock",
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });
});
