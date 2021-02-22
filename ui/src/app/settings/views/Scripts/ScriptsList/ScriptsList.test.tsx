import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ScriptsList from ".";

import type { RootState } from "app/store/root/types";
import {
  scripts as scriptsFactory,
  scriptsState as scriptsStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ScriptsList", () => {
  let initialState: RootState;
  beforeEach(() => {
    initialState = rootStateFactory({
      scripts: scriptsStateFactory({
        loaded: true,
        items: [
          scriptsFactory({
            id: 1,
            name: "commissioning-script",
            description: "a commissioning script",
            type: 0,
            history: [
              {
                id: 1,
                comment: "a history item",
                created: "Tue, 02 Jul 2019 05:24:10 -0000",
                data: "",
              },
            ],
          }),
          scriptsFactory({
            id: 2,
            name: "testing-script",
            description: "a testing script",
            type: 2,
            history: [
              {
                id: 2,
                comment: "a history item",
                created: "Tue, 02 Jul 2019 05:24:10 -0000",
                data: "",
              },
            ],
          }),
          scriptsFactory({
            id: 3,
            name: "testing-script-2",
            description: "another testing script",
            type: 2,
            history: [
              {
                id: 1,
                comment: "a history item",
                created: "Tue, 02 Jul 2019 05:24:10 -0000",
                data: "",
              },
            ],
          }),
        ],
      }),
    });
  });

  it("fetches scripts if they haven't been loaded yet", () => {
    const state = { ...initialState };
    state.scripts.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "FETCH_SCRIPTS")
    ).toBe(true);
  });

  it("does not fetch scripts if they've already been loaded", () => {
    const state = { ...initialState };
    state.scripts.loaded = true;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "FETCH_SCRIPTS")
    ).toBe(false);
  });

  it("Displays commissioning scripts by default", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("MainTable").prop("rows").length).toEqual(1);
    expect(
      wrapper.find("MainTable").prop("rows")[0].columns[1].content
    ).toEqual("a commissioning script");
  });

  it("Displays testing scripts", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList type="testing" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("MainTable").prop("rows").length).toEqual(2);
    expect(
      wrapper.find("MainTable").prop("rows")[0].columns[1].content
    ).toEqual("a testing script");
    expect(
      wrapper.find("MainTable").prop("rows")[1].columns[1].content
    ).toEqual("another testing script");
  });

  it("can show a delete confirmation", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );

    let row = wrapper.find("MainTable").prop("rows")[0];
    expect(row.expanded).toBe(false);
    // Click on the delete button:
    wrapper.find("TableRow").at(1).find("Button").at(1).simulate("click");
    row = wrapper.find("MainTable").prop("rows")[0];
    expect(row.expanded).toBe(true);
  });

  it("disables the delete button if a default script", () => {
    const state = rootStateFactory({
      scripts: scriptsStateFactory({
        loaded: true,
        items: [
          scriptsFactory({
            default: true,
            type: 2,
          }),
          scriptsFactory({
            default: false,
            type: 2,
          }),
        ],
      }),
    });
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList type="testing" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("TableRow").at(1).find("Button").at(1).prop("disabled")
    ).toBe(true);

    expect(
      wrapper.find("TableRow").at(2).find("Button").at(1).prop("disabled")
    ).toBe(false);
  });

  it("can delete a script", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );
    // Click on the delete button:
    wrapper.find("TableRow").at(1).find("Button").at(1).simulate("click");
    // Click on the delete confirm button
    wrapper.find("TableRow").at(1).find("Button").at(3).simulate("click");
    expect(
      store.getActions().find((action) => action.type === "DELETE_SCRIPT")
    ).toEqual({
      type: "DELETE_SCRIPT",
      payload: {
        id: 1,
        name: "commissioning-script",
      },
    });
  });

  it("can add a message when a script is deleted", () => {
    const state = { ...initialState };
    state.scripts.saved = true;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "CLEANUP_SCRIPTS")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "ADD_MESSAGE")).toBe(true);
  });

  it("can show script source", () => {
    const state = { ...initialState };
    const scriptSource = "#!/usr/bin/env bash/necho 'hello maas'";
    state.scripts.items[0].history[0].data = btoa(scriptSource);
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );
    let row = wrapper.find("MainTable").prop("rows")[0];
    expect(row.expanded).toBe(false);
    // Click on the expand button:
    wrapper.find("TableRow").at(1).find("Button").at(0).simulate("click");
    row = wrapper.find("MainTable").prop("rows")[0];
    expect(row.expanded).toBe(true);
    // expect script source to be decoded base64
    expect(wrapper.find("TableRow").find("Code").text()).toEqual(scriptSource);
  });
});
