import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import FieldlessForm from "./FieldlessForm";

import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineAction as machineActionFactory,
  machineActionsState as machineActionsStateFactory,
  machineEventError as machineEventErrorFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";

jest.mock("@canonical/react-components/dist/hooks", () => ({
  usePrevious: jest.fn(),
}));

const mockStore = configureStore();

describe("FieldlessForm", () => {
  let initialState: RootState;

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
          abc123: machineStatusFactory(),
        },
      }),
      general: generalStateFactory({
        machineActions: machineActionsStateFactory({
          data: [
            machineActionFactory({ name: NodeActions.ABORT, title: "Abort" }),
            machineActionFactory({
              name: NodeActions.ACQUIRE,
              title: "Acquire",
            }),
            machineActionFactory({ name: NodeActions.DELETE, title: "Delete" }),
            machineActionFactory({
              name: NodeActions.EXIT_RESCUE_MODE,
              title: "Exit rescue mode",
            }),
            machineActionFactory({ name: NodeActions.LOCK, title: "Lock" }),
            machineActionFactory({
              name: NodeActions.MARK_FIXED,
              title: "Mark fixed",
            }),
            machineActionFactory({ name: NodeActions.OFF, title: "Power off" }),
            machineActionFactory({ name: NodeActions.ON, title: "Power on" }),
            machineActionFactory({
              name: NodeActions.RESCUE_MODE,
              title: "Rescue mode",
            }),
            machineActionFactory({ name: NodeActions.UNLOCK, title: "Unlock" }),
          ],
        }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
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
            selectedAction={{ name: NodeActions.ON }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FieldlessForm")).toMatchSnapshot();
  });

  it("can unset the selected action", () => {
    const state = { ...initialState };
    state.machine.items = [
      machineFactory({ system_id: "a", actions: [NodeActions.ON] }),
    ];
    state.machine.selected = ["a"];
    state.machine.statuses = { a: machineStatusFactory() };
    const store = mockStore(state);
    const setSelectedAction = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: NodeActions.ON }}
            setSelectedAction={setSelectedAction}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="cancel-action"] button').simulate("click");

    expect(setSelectedAction).toHaveBeenCalledWith(null, true);
  });

  it("can dispatch abort action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.ABORT] }),
    ];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: NodeActions.ABORT }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "machine/abort")
    ).toStrictEqual([
      {
        type: "machine/abort",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.ABORT,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch abort action from details view", () => {
    const state = { ...initialState };
    state.machine.active = "abc123";
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
                selectedAction={{ name: NodeActions.ABORT }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "machine/abort")
    ).toStrictEqual([
      {
        type: "machine/abort",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.ABORT,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch acquire action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.ACQUIRE] }),
    ];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: NodeActions.ACQUIRE }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "machine/acquire")
    ).toStrictEqual([
      {
        type: "machine/acquire",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.ACQUIRE,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch acquire action from details view", () => {
    const state = { ...initialState };
    state.machine.active = "abc123";
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
                selectedAction={{ name: NodeActions.ACQUIRE }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store.getActions().filter(({ type }) => type === "machine/acquire")
    ).toStrictEqual([
      {
        type: "machine/acquire",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.ACQUIRE,
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
      machineFactory({
        system_id: "abc123",
        actions: [NodeActions.EXIT_RESCUE_MODE],
      }),
    ];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: NodeActions.EXIT_RESCUE_MODE }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "machine/exitRescueMode")
    ).toStrictEqual([
      {
        type: "machine/exitRescueMode",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.EXIT_RESCUE_MODE,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch exit rescue mode action from details view", () => {
    const state = { ...initialState };
    state.machine.active = "abc123";
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
                selectedAction={{ name: NodeActions.EXIT_RESCUE_MODE }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store.getActions().filter(({ type }) => type === "machine/exitRescueMode")
    ).toStrictEqual([
      {
        type: "machine/exitRescueMode",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.EXIT_RESCUE_MODE,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch lock action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.LOCK] }),
    ];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: NodeActions.LOCK }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "machine/lock")
    ).toStrictEqual([
      {
        type: "machine/lock",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.LOCK,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch lock action from details view", () => {
    const state = { ...initialState };
    state.machine.active = "abc123";
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
                selectedAction={{ name: NodeActions.LOCK }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store.getActions().filter(({ type }) => type === "machine/lock")
    ).toStrictEqual([
      {
        type: "machine/lock",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.LOCK,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch mark fixed action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [
      machineFactory({
        system_id: "abc123",
        actions: [NodeActions.MARK_FIXED],
      }),
    ];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: NodeActions.MARK_FIXED }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "machine/markFixed")
    ).toStrictEqual([
      {
        type: "machine/markFixed",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.MARK_FIXED,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch mark fixed action from details view", () => {
    const state = { ...initialState };
    state.machine.active = "abc123";
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
                selectedAction={{ name: NodeActions.MARK_FIXED }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store.getActions().filter(({ type }) => type === "machine/markFixed")
    ).toStrictEqual([
      {
        type: "machine/markFixed",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.MARK_FIXED,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch power off action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.OFF] }),
    ];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: NodeActions.OFF }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "machine/off")
    ).toStrictEqual([
      {
        type: "machine/off",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.OFF,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch power off action from details view", () => {
    const state = { ...initialState };
    state.machine.active = "abc123";
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
                selectedAction={{ name: NodeActions.OFF }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store.getActions().filter(({ type }) => type === "machine/off")
    ).toStrictEqual([
      {
        type: "machine/off",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.OFF,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch power on action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.ON] }),
    ];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: NodeActions.ON }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "machine/on")
    ).toStrictEqual([
      {
        type: "machine/on",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.ON,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch power on action from details view", () => {
    const state = { ...initialState };
    state.machine.active = "abc123";
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
                selectedAction={{ name: NodeActions.ON }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store.getActions().filter(({ type }) => type === "machine/on")
    ).toStrictEqual([
      {
        type: "machine/on",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.ON,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch unlock action on selected machines", () => {
    const state = { ...initialState };
    state.machine.items = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.UNLOCK] }),
    ];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            selectedAction={{ name: NodeActions.UNLOCK }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());
    expect(
      store.getActions().filter(({ type }) => type === "machine/unlock")
    ).toStrictEqual([
      {
        type: "machine/unlock",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.UNLOCK,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch unlock action from details view", () => {
    const state = { ...initialState };
    state.machine.active = "abc123";
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
                selectedAction={{ name: NodeActions.UNLOCK }}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").props().onSubmit());

    expect(
      store.getActions().filter(({ type }) => type === "machine/unlock")
    ).toStrictEqual([
      {
        type: "machine/unlock",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.UNLOCK,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  describe("delete", () => {
    it("displays a negative submit button if selected action is delete", () => {
      const state = { ...initialState };
      state.machine.items = [
        machineFactory({ system_id: "abc123", actions: [NodeActions.DELETE] }),
      ];
      state.machine.selected = ["abc123"];
      const store = mockStore(state);
      const setSelectedAction = jest.fn();
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <FieldlessForm
              selectedAction={{ name: NodeActions.DELETE }}
              setSelectedAction={setSelectedAction}
            />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find("ActionButton").prop("appearance")).toBe("negative");
    });

    it("can dispatch delete action on selected machines", () => {
      const state = { ...initialState };
      state.machine.items = [
        machineFactory({ system_id: "abc123", actions: [NodeActions.DELETE] }),
      ];
      state.machine.selected = ["abc123"];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <FieldlessForm
              selectedAction={{ name: NodeActions.DELETE }}
              setSelectedAction={jest.fn()}
            />
          </MemoryRouter>
        </Provider>
      );

      act(() => wrapper.find("Formik").props().onSubmit());
      expect(
        store.getActions().filter(({ type }) => type === "machine/delete")
      ).toStrictEqual([
        {
          type: "machine/delete",
          meta: {
            model: "machine",
            method: "action",
          },
          payload: {
            params: {
              action: NodeActions.DELETE,
              extra: {},
              system_id: "abc123",
            },
          },
        },
      ]);
    });

    it("can dispatch delete action from details view", () => {
      const state = { ...initialState };
      state.machine.active = "abc123";
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
                  selectedAction={{ name: NodeActions.DELETE }}
                  setSelectedAction={jest.fn()}
                />
              )}
            />
          </MemoryRouter>
        </Provider>
      );

      act(() => wrapper.find("Formik").props().onSubmit());

      expect(
        store.getActions().filter(({ type }) => type === "machine/delete")
      ).toStrictEqual([
        {
          type: "machine/delete",
          meta: {
            model: "machine",
            method: "action",
          },
          payload: {
            params: {
              action: NodeActions.DELETE,
              extra: {},
              system_id: "abc123",
            },
          },
        },
      ]);
    });

    it("redirects when a machine is deleted", () => {
      const state = { ...initialState };
      state.machine.active = "abc123";
      state.machine.selected = [];
      state.machine.statuses.abc123.deleting = false;
      jest
        .spyOn(reactComponentHooks, "usePrevious")
        .mockImplementation(() => true);
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <FieldlessForm
              selectedAction={{ name: NodeActions.DELETE }}
              setSelectedAction={jest.fn()}
            />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find("Redirect").exists()).toBe(true);
    });

    it("does not redirect if there are errors", () => {
      const state = { ...initialState };
      state.machine.active = "abc123";
      state.machine.selected = [];
      state.machine.statuses.abc123.deleting = false;
      state.machine.eventErrors = [
        machineEventErrorFactory({
          id: "abc123",
          event: "delete",
          error: "uh oh",
        }),
      ];
      jest
        .spyOn(reactComponentHooks, "usePrevious")
        .mockImplementation(() => true);
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <FieldlessForm
              selectedAction={{ name: NodeActions.DELETE }}
              setSelectedAction={jest.fn()}
            />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find("Redirect").exists()).toBe(false);
    });
  });
});
