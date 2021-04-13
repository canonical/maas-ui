import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ScriptsList from ".";

import type { RootState } from "app/store/root/types";
import { ScriptType } from "app/store/script/types";
import {
  script as scriptFactory,
  scriptState as scriptStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ScriptsList", () => {
  let initialState: RootState;
  beforeEach(() => {
    initialState = rootStateFactory({
      script: scriptStateFactory({
        loaded: true,
        items: [
          scriptFactory({
            id: 1,
            name: "commissioning-script",
            description: "a commissioning script",
            script_type: ScriptType.COMMISSIONING,
          }),
          scriptFactory({
            id: 2,
            name: "testing-script",
            description: "a testing script",
            script_type: ScriptType.TESTING,
          }),
          scriptFactory({
            id: 3,
            name: "testing-script-2",
            description: "another testing script",
            script_type: ScriptType.TESTING,
          }),
        ],
      }),
    });
  });

  it("fetches scripts if they haven't been loaded yet", () => {
    const state = { ...initialState };
    state.script.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "script/fetch")
    ).toBe(true);
  });

  it("does not fetch scripts if they've already been loaded", () => {
    const state = { ...initialState };
    state.script.loaded = true;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "script/fetch")
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
      script: scriptStateFactory({
        loaded: true,
        items: [
          scriptFactory({
            default: true,
            script_type: ScriptType.TESTING,
          }),
          scriptFactory({
            default: false,
            script_type: ScriptType.TESTING,
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
      store.getActions().find((action) => action.type === "script/delete")
    ).toEqual({
      meta: {
        method: "delete",
        model: "script",
      },
      type: "script/delete",
      payload: {
        params: {
          id: 1,
        },
      },
    });
  });

  it("can add a message when a script is deleted", () => {
    const state = { ...initialState };
    state.script.saved = true;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "script/cleanup")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });

  it("can show script source", () => {
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
    // Click on the expand button:
    wrapper.find("TableRow").at(1).find("Button").at(0).simulate("click");
    row = wrapper.find("MainTable").prop("rows")[0];
    expect(row.expanded).toBe(true);
    // expect script source to be decoded base64
    expect(wrapper.find("TableRow").find("ScriptDetails").exists()).toEqual(
      true
    );
  });
});
