import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { DhcpForm } from "./DhcpForm";

import dhcpsnippetSelectors from "app/store/dhcpsnippet/selectors";
import type { RootState } from "app/store/root/types";
import {
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("DhcpForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        items: [
          dhcpSnippetFactory({
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 1,
            name: "lease",
            updated: "Thu, 15 Aug. 2019 06:21:39",
            value: "lease 10",
          }),
          dhcpSnippetFactory({
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 2,
            name: "class",
            updated: "Thu, 15 Aug. 2019 06:21:39",
          }),
        ],
        loaded: true,
      }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm analyticsCategory="settings" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("DhcpForm").exists()).toBe(true);
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm analyticsCategory="settings" />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.unmount();
    });

    expect(
      store.getActions().some((action) => action.type === "dhcpsnippet/cleanup")
    ).toBe(true);
  });

  it("can update a snippet", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm
            analyticsCategory="settings"
            id={state.dhcpsnippet.items[0].id}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      submitFormikForm(wrapper, {
        name: "new-lease",
        id: 1,
      })
    );
    expect(
      store.getActions().find((action) => action.type === "dhcpsnippet/update")
    ).toStrictEqual({
      type: "dhcpsnippet/update",
      payload: {
        params: {
          description: undefined,
          enabled: undefined,
          id: 1,
          name: "new-lease",
          value: undefined,
        },
      },
      meta: {
        model: "dhcpsnippet",
        method: "update",
      },
    });
  });

  it("can create a snippet", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm analyticsCategory="settings" />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      submitFormikForm(wrapper, {
        name: "new-lease",
      })
    );
    expect(
      store.getActions().find((action) => action.type === "dhcpsnippet/create")
    ).toStrictEqual({
      type: "dhcpsnippet/create",
      payload: {
        params: {
          description: undefined,
          enabled: undefined,
          value: undefined,
          name: "new-lease",
        },
      },
      meta: {
        model: "dhcpsnippet",
        method: "create",
      },
    });
  });

  it("can call the onSave on success", () => {
    state.dhcpsnippet.saved = false;
    const onSave = jest.fn();
    const store = mockStore(state);
    const Proxy = ({ analyticsCategory }: { analyticsCategory: string }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm analyticsCategory={analyticsCategory} onSave={onSave} />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy analyticsCategory="settings" />);
    act(() =>
      submitFormikForm(wrapper, {
        name: "new-lease",
      })
    );
    jest.spyOn(dhcpsnippetSelectors, "saved").mockReturnValue(true);
    wrapper.setProps({ analyticsCategory: "newvalue" });
    expect(onSave).toHaveBeenCalled();
  });

  it("does not call onSave if there is an error", () => {
    state.dhcpsnippet.errors = "Uh oh!";
    const onSave = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm analyticsCategory="settings" onSave={onSave} />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      submitFormikForm(wrapper, {
        name: "new-lease",
      })
    );
    expect(onSave).not.toHaveBeenCalled();
  });

  it("adds a message when a snippet is added", () => {
    state.dhcpsnippet.saved = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm analyticsCategory="settings" />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(
      actions.some((action) => action.type === "dhcpsnippet/cleanup")
    ).toBe(true);
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });

  it("fetches models when editing", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm
            analyticsCategory="settings"
            id={state.dhcpsnippet.items[0].id}
          />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "machine/fetch")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "device/fetch")).toBe(true);
    expect(actions.some((action) => action.type === "subnet/fetch")).toBe(true);
    expect(actions.some((action) => action.type === "controller/fetch")).toBe(
      true
    );
  });

  it("shows a spinner when loading models", () => {
    state.subnet.loading = true;
    state.device.loading = true;
    state.controller.loading = true;
    state.machine.loading = true;
    state.subnet.loaded = false;
    state.device.loaded = false;
    state.controller.loaded = false;
    state.machine.loaded = false;
    const store = mockStore(state);
    state.dhcpsnippet.items[0].node = "xyz";
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm
            analyticsCategory="settings"
            id={state.dhcpsnippet.items[0].id}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
    expect(wrapper.find("FormikFormContent").exists()).toBe(false);
  });
});
