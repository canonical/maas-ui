import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import FieldlessForm from "./FieldlessForm";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("FieldlessForm", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
          }),
        ],
        selected: [],
        statuses: {
          abc123: {},
        },
      }),
      general: generalStateFactory({
        machineActions: {
          data: [
            { name: "abort", sentence: "abort" },
            { name: "acquire", sentence: "acquire" },
            { name: "delete", sentence: "delete" },
            { name: "exit-rescue-mode", sentence: "exit-rescue-mode" },
            { name: "lock", sentence: "lock" },
            { name: "mark-fixed", sentence: "mark-fixed" },
            { name: "off", sentence: "off" },
            { name: "on", sentence: "on" },
            { name: "release", sentence: "release" },
            { name: "rescue-mode", sentence: "rescue-mode" },
            { name: "unlock", sentence: "unlock" },
          ],
        },
      }),
    });
  });

  it("renders", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: "release" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FieldlessForm")).toMatchSnapshot();
  });

  it("can unset the selected action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "a", actions: ["release"] }];
    state.machine.selected = ["a"];
    state.machine.statuses = { a: {} };
    const store = mockStore(state);
    const setSelectedAction = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: "release" }}
            setSelectedAction={setSelectedAction}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="cancel-action"] button').simulate("click");

    expect(setSelectedAction).toHaveBeenCalledWith(null, true);
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
          <FieldlessForm
            selectedAction={{ name: "delete" }}
            setSelectedAction={setSelectedAction}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("ActionButton").props().appearance).toBe("negative");
  });

  it("can dispatch abort action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["abort"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: "abort" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "ABORT_MACHINE")
    ).toStrictEqual([
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

  it("can dispatch abort action from details view", () => {
    const state = { ...initialState };
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <FieldlessForm
                selectedAction={{ name: "abort" }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "ABORT_MACHINE")
    ).toStrictEqual([
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

  it("can dispatch acquire action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["acquire"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: "acquire" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "ACQUIRE_MACHINE")
    ).toStrictEqual([
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

  it("can dispatch acquire action from details view", () => {
    const state = { ...initialState };
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <FieldlessForm
                selectedAction={{ name: "acquire" }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store.getActions().filter(({ type }) => type === "ACQUIRE_MACHINE")
    ).toStrictEqual([
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

  it("can dispatch delete action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["delete"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: "delete" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "DELETE_MACHINE")
    ).toStrictEqual([
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

  it("can dispatch delete action from details view", () => {
    const state = { ...initialState };
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <FieldlessForm
                selectedAction={{ name: "delete" }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store.getActions().filter(({ type }) => type === "DELETE_MACHINE")
    ).toStrictEqual([
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

  it("can dispatch exit rescue mode action on selected machines", () => {
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
          <FieldlessForm
            selectedAction={{ name: "exit-rescue-mode" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store
        .getActions()
        .filter(({ type }) => type === "MACHINE_EXIT_RESCUE_MODE")
    ).toStrictEqual([
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

  it("can dispatch exit rescue mode action from details view", () => {
    const state = { ...initialState };
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <FieldlessForm
                selectedAction={{ name: "exit-rescue-mode" }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store
        .getActions()
        .filter(({ type }) => type === "MACHINE_EXIT_RESCUE_MODE")
    ).toStrictEqual([
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

  it("can dispatch lock action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["lock"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: "lock" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "LOCK_MACHINE")
    ).toStrictEqual([
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

  it("can dispatch lock action from details view", () => {
    const state = { ...initialState };
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <FieldlessForm
                selectedAction={{ name: "lock" }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store.getActions().filter(({ type }) => type === "LOCK_MACHINE")
    ).toStrictEqual([
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

  it("can dispatch mark fixed action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["mark-fixed"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: "mark-fixed" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "MARK_MACHINE_FIXED")
    ).toStrictEqual([
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

  it("can dispatch mark fixed action from details view", () => {
    const state = { ...initialState };
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <FieldlessForm
                selectedAction={{ name: "mark-fixed" }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store.getActions().filter(({ type }) => type === "MARK_MACHINE_FIXED")
    ).toStrictEqual([
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

  it("can dispatch power off action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["off"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: "off" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "TURN_MACHINE_OFF")
    ).toStrictEqual([
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

  it("can dispatch power off action from details view", () => {
    const state = { ...initialState };
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <FieldlessForm
                selectedAction={{ name: "off" }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store.getActions().filter(({ type }) => type === "TURN_MACHINE_OFF")
    ).toStrictEqual([
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

  it("can dispatch power on action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["on"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: "on" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "TURN_MACHINE_ON")
    ).toStrictEqual([
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

  it("can dispatch power on action from details view", () => {
    const state = { ...initialState };
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <FieldlessForm
                selectedAction={{ name: "on" }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store.getActions().filter(({ type }) => type === "TURN_MACHINE_ON")
    ).toStrictEqual([
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

  it("can dispatch release action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["release"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: "release" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "RELEASE_MACHINE")
    ).toStrictEqual([
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

  it("can dispatch release action from details view", () => {
    const state = { ...initialState };
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <FieldlessForm
                selectedAction={{ name: "release" }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store.getActions().filter(({ type }) => type === "RELEASE_MACHINE")
    ).toStrictEqual([
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

  it("can dispatch unlock action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "abc123", actions: ["unlock"] }];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: "unlock" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "UNLOCK_MACHINE")
    ).toStrictEqual([
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

  it("can dispatch unlock action from details view", () => {
    const state = { ...initialState };
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <FieldlessForm
                selectedAction={{ name: "unlock" }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store.getActions().filter(({ type }) => type === "UNLOCK_MACHINE")
    ).toStrictEqual([
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
