import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ActionFormWrapper from "./ActionFormWrapper";

import * as baseHooks from "app/base/hooks/base";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ActionFormWrapper", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(`displays a warning if not all selected machines can perform selected
      action`, () => {
    const machines = [
      machineFactory({ system_id: "a", actions: [NodeActions.ABORT] }),
      machineFactory({ system_id: "b", actions: [] }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionFormWrapper
            action={NodeActions.ABORT}
            clearHeaderContent={jest.fn()}
            machines={machines}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("[data-testid='machine-action-warning']").exists()
    ).toBe(true);
  });

  it(`does not display a warning when action has started and not all selected
      machines can perform selected action`, async () => {
    // Mock that action has started.
    jest
      .spyOn(baseHooks, "useCycled")
      .mockImplementation(() => [true, () => null]);
    const machines = [
      machineFactory({ system_id: "a", actions: [NodeActions.COMMISSION] }),
      machineFactory({ system_id: "b", actions: [] }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionFormWrapper
            action={NodeActions.COMMISSION}
            clearHeaderContent={jest.fn()}
            machines={machines}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>,
      { context: store }
    );

    await act(async () => {
      expect(
        wrapper.find("[data-testid='machine-action-warning']").exists()
      ).toBe(false);
    });
  });

  it("can set selected machines to those that can perform action", () => {
    const machines = [
      machineFactory({ system_id: "a", actions: [NodeActions.ABORT] }),
      machineFactory({ system_id: "b", actions: [] }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionFormWrapper
            action={NodeActions.ABORT}
            clearHeaderContent={jest.fn()}
            machines={machines}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find('[data-testid="select-actionable-machines"] button')
      .simulate("click");

    expect(
      store.getActions().find((action) => action.type === "machine/setSelected")
    ).toStrictEqual({
      type: "machine/setSelected",
      payload: ["a"],
    });
  });
});
