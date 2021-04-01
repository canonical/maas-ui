import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router";
import configureStore from "redux-mock-store";

import MachineTestsDetails from ".";

import type { RootState } from "app/store/root/types";
import {
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultResult as scriptResultResultFactory,
  scriptResultState as scriptResultStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineTestDetails", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineDetailsFactory({
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
      scriptresult: scriptResultStateFactory({
        loaded: true,
        items: [scriptResultFactory()],
      }),
    });
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineTestsDetails />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("displays a spinner when loading", () => {
    state.scriptresult.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/machine/abc123/testing/1/details"]}>
          <Route path="/machine/:id/testing/:scriptResultId/details">
            <MachineTestsDetails />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a message if script results aren't found", () => {
    state.scriptresult.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/machine/abc123/testing/1/details"]}>
          <Route path="/machine/:id/testing/:scriptResultId/details">
            <MachineTestsDetails />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='not-found']").exists()).toBe(true);
  });

  it("fetches script results", () => {
    const scriptResult = scriptResultFactory({ id: 1 });
    const scriptResults = [scriptResult];
    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult.items = scriptResults;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/machine/abc123/testing/1/details"]}>
          <Route path="/machine/:id/testing/:scriptResultId/details">
            <MachineTestsDetails />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    expect(
      store.getActions().find((action) => action.type === "scriptresult/get")
    ).toStrictEqual({
      meta: {
        method: "get",
        model: "noderesult",
      },
      payload: {
        params: {
          id: 1,
        },
      },
      type: "scriptresult/get",
    });
  });

  it("only fetches script results once", () => {
    const scriptResult = scriptResultFactory({ id: 1 });
    const scriptResults = [scriptResult];
    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult.items = scriptResults;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/machine/abc123/testing/1/details"]}>
          <Route path="/machine/:id/testing/:scriptResultId/details">
            <MachineTestsDetails />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    expect(
      store.getActions().filter((action) => action.type === "scriptresult/get")
        .length
    ).toBe(1);
    wrapper.setProps({});
    wrapper.update();
    expect(
      store.getActions().filter((action) => action.type === "scriptresult/get")
        .length
    ).toBe(1);
  });

  it("displays script result details", () => {
    const scriptResult = scriptResultFactory({ id: 1 });
    const scriptResults = [scriptResult];
    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult.items = scriptResults;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/machine/abc123/testing/1/details"]}>
          <Route path="/machine/:id/testing/:scriptResultId/details">
            <MachineTestsDetails />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("ScriptStatus").text()).toEqual(
      scriptResult.status_name
    );
  });

  it("displays script result metrics", () => {
    const metrics = scriptResultResultFactory({
      title: "test-title",
      value: "test-value",
    });
    const scriptResults = [scriptResultFactory({ id: 1, results: [metrics] })];

    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult.items = scriptResults;

    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/machine/abc123/testing/1/details"]}>
          <Route path="/machine/:id/testing/:scriptResultId/details">
            <MachineTestsDetails />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("table[data-test='script-details-metrics']").exists()
    ).toEqual(true);
    expect(
      wrapper
        .find("table[data-test='script-details-metrics'] tr")
        .at(0)
        .find("td")
        .at(0)
        .text()
    ).toEqual("test-title");
    expect(
      wrapper
        .find("table[data-test='script-details-metrics'] tr")
        .at(0)
        .find("td")
        .at(1)
        .text()
    ).toEqual("test-value");
  });

  it("fetches script result logs", () => {
    const scriptResults = [scriptResultFactory({ id: 1 })];

    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult.items = scriptResults;

    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/machine/abc123/testing/1/details"]}>
          <Route path="/machine/:id/testing/:scriptResultId/details">
            <MachineTestsDetails />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    const actions = store
      .getActions()
      .filter((action) => action.type === "scriptresult/getLogs");
    expect(actions[0].payload.params.data_type).toEqual("combined");
    expect(actions[1].payload.params.data_type).toEqual("stdout");
    expect(actions[2].payload.params.data_type).toEqual("stderr");
    expect(actions[3].payload.params.data_type).toEqual("result");
  });
});
