import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ScriptsList from ".";

const mockStore = configureStore();

describe("ScriptsList", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      scripts: {
        loading: false,
        loaded: true,
        items: [
          {
            id: 1,
            name: "commissioning script",
            description: "a commissioning script",
            type: 0,
            history: [
              {
                id: 1,
                comment: "a history item",
                created: "Tue, 02 Jul 2019 05:24:10 -0000",
                data: ""
              }
            ]
          },
          {
            id: 2,
            name: "testing script",
            description: "a testing script",
            type: 2,
            history: [
              {
                id: 2,
                comment: "a history item",
                created: "Tue, 02 Jul 2019 05:24:10 -0000",
                data: ""
              }
            ]
          },
          {
            id: 3,
            name: "testing script two",
            description: "another testing script",
            type: 2,
            history: [
              {
                id: 1,
                comment: "a history item",
                created: "Tue, 02 Jul 2019 05:24:10 -0000",
                data: ""
              }
            ]
          }
        ]
      }
    };
  });

  it("displays a loading component if loading", () => {
    const state = { ...initialState };
    state.scripts.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("hides the table if scripts haven't loaded", () => {
    const state = { ...initialState };
    state.scripts.loaded = false;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("MainTable").exists()).toBe(false);
  });

  it("shows the table if there are scripts", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("MainTable").exists()).toBe(true);
  });

  it("dispatches action to fetch scripts load", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsList />
        </MemoryRouter>
      </Provider>
    );

    expect(store.getActions()).toEqual([
      {
        type: "FETCH_SCRIPTS"
      }
    ]);
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
    wrapper
      .find("TableRow")
      .at(1)
      .find("Button")
      .at(1)
      .simulate("click");
    row = wrapper.find("MainTable").prop("rows")[0];
    expect(row.expanded).toBe(true);
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
    wrapper
      .find("TableRow")
      .at(1)
      .find("Button")
      .at(0)
      .simulate("click");
    row = wrapper.find("MainTable").prop("rows")[0];
    expect(row.expanded).toBe(true);
    // expect script source to be decoded base64
    expect(
      wrapper
        .find("TableRow")
        .find("Code")
        .text()
    ).toEqual(scriptSource);
  });
});
