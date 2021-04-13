import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ScriptDetails from ".";

import FileContext, { fileContextStore } from "app/base/file-context";
import type { RootState } from "app/store/root/types";
import { ScriptType } from "app/store/script/types";
import {
  script as scriptFactory,
  scriptState as scriptStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ScriptDetails", () => {
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
        ],
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("fetches the script", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptDetails id={1} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      store.getActions().some((action) => action.type === "script/get")
    ).toBe(true);
  });

  it("displays a spinner while loading", () => {
    state.script.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptDetails id={1} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a message when the script does not exist", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptDetails id={1} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.text()).toBe("Script could not be found");
  });

  it("can display the script", () => {
    jest.spyOn(fileContextStore, "get").mockReturnValue("test script contents");
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <FileContext.Provider value={fileContextStore}>
            <ScriptDetails id={1} />
          </FileContext.Provider>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Code").text()).toBe("test script contents");
  });
});
