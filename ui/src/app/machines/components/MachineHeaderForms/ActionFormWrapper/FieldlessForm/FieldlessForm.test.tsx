import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import FieldlessForm from "./FieldlessForm";

import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineEventError as machineEventErrorFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

jest.mock("@canonical/react-components/dist/hooks", () => ({
  usePrevious: jest.fn(),
}));

const mockStore = configureStore();

describe("FieldlessForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
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
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("can unset the selected action", () => {
    const store = mockStore(state);
    const clearHeaderContent = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            action={NodeActions.ON}
            clearHeaderContent={clearHeaderContent}
            machines={[state.machine.items[0]]}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-testid="cancel-action"] button').simulate("click");

    expect(clearHeaderContent).toHaveBeenCalled();
  });

  it("can dispatch abort action on given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            action={NodeActions.ABORT}
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    submitFormikForm(wrapper);
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

  it("can dispatch acquire action on given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            action={NodeActions.ACQUIRE}
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    submitFormikForm(wrapper);
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

  it("can dispatch exit rescue mode action on given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            action={NodeActions.EXIT_RESCUE_MODE}
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    submitFormikForm(wrapper);
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

  it("can dispatch lock action on given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            action={NodeActions.LOCK}
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    submitFormikForm(wrapper);
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

  it("can dispatch mark fixed action on given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            action={NodeActions.MARK_FIXED}
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    submitFormikForm(wrapper);
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

  it("can dispatch power off action on given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            action={NodeActions.OFF}
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    submitFormikForm(wrapper);
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

  it("can dispatch power on action on given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            action={NodeActions.ON}
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    submitFormikForm(wrapper);
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

  it("can dispatch unlock action on given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FieldlessForm
            action={NodeActions.UNLOCK}
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    submitFormikForm(wrapper);
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
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <FieldlessForm
              action={NodeActions.DELETE}
              clearHeaderContent={jest.fn()}
              machines={[state.machine.items[0]]}
              viewingDetails={false}
            />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find("ActionButton").prop("appearance")).toBe("negative");
    });

    it("can dispatch delete action on given machines", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <FieldlessForm
              action={NodeActions.DELETE}
              clearHeaderContent={jest.fn()}
              machines={[state.machine.items[0]]}
              viewingDetails={false}
            />
          </MemoryRouter>
        </Provider>
      );

      submitFormikForm(wrapper);
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

    it("redirects when a machine is deleted from details view", () => {
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
              action={NodeActions.DELETE}
              clearHeaderContent={jest.fn()}
              machines={[state.machine.items[0]]}
              viewingDetails
            />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find("Redirect").exists()).toBe(true);
    });

    it("does not redirect if there are errors", () => {
      state.machine.selected = ["abc123"];
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
              action={NodeActions.DELETE}
              clearHeaderContent={jest.fn()}
              machines={[state.machine.items[0]]}
              viewingDetails={false}
            />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find("Redirect").exists()).toBe(false);
    });
  });
});
