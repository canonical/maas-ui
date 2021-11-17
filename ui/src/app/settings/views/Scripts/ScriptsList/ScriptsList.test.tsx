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
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
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
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("TableRow[data-testid='script-row']").length).toEqual(
      1
    );
    expect(
      wrapper
        .find("[data-testid='script-row']")
        .at(0)
        .find("TableCell")
        .at(1)
        .text()
    ).toEqual("a commissioning script");
  });

  it("Displays testing scripts", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList type="testing" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("TableRow[data-testid='script-row']").length).toEqual(
      2
    );
    expect(
      wrapper
        .find("TableRow[data-testid='script-row']")
        .at(0)
        .find("TableCell")
        .at(1)
        .text()
    ).toEqual("a testing script");
    expect(
      wrapper
        .find("TableRow[data-testid='script-row']")
        .at(1)
        .find("TableCell")
        .at(1)
        .text()
    ).toEqual("another testing script");
  });

  it("can show a delete confirmation", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );

    let row = wrapper.find("[data-testid='script-row']").at(0);
    expect(row.hasClass("is-active")).toBe(false);
    // Click on the delete button:
    wrapper.find("TableRow").at(1).find("Button").at(1).simulate("click");
    row = wrapper.find("[data-testid='script-row']").at(0);
    expect(row.hasClass("is-active")).toBe(true);
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
    wrapper
      .find("TableRow")
      .at(1)
      .find("ActionButton[data-testid='action-confirm']")
      .simulate("click");
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
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );
    let row = wrapper.find("[data-testid='script-row']").at(0);
    expect(row.hasClass("is-active")).toBe(false);
    // Click on the expand button:
    wrapper.find("TableRow").at(1).find("Button").at(0).simulate("click");
    row = wrapper.find("[data-testid='script-row']").at(0);
    expect(row.hasClass("is-active")).toBe(true);
    // expect script source to be decoded base64
    expect(wrapper.find("TableRow").find("ScriptDetails").exists()).toEqual(
      true
    );
  });

  it("correctly formats script creation date", () => {
    const state = rootStateFactory({
      script: scriptStateFactory({
        loaded: true,
        items: [
          scriptFactory({
            created: "Thu, 31 Dec. 2020 22:59:00",
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
    expect(wrapper.find("[data-testid='upload-date']").text()).toBe(
      "2020-12-31 22:59"
    );
  });

  it("formats script creation date as 'Never' if date cannot be parsed", () => {
    const state = rootStateFactory({
      script: scriptStateFactory({
        loaded: true,
        items: [
          scriptFactory({
            created: "",
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
    expect(wrapper.find("[data-testid='upload-date']").text()).toBe("Never");
  });
});
