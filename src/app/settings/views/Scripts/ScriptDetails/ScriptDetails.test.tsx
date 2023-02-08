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
import { screen, render, renderWithMockStore } from "testing/utils";

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
    render(
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
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <ScriptDetails id={1} />
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("displays a message when the script does not exist", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <ScriptDetails id={1} />
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByText("Script could not be found")).toBeInTheDocument();
  });

  it("can display the script", () => {
    jest.spyOn(fileContextStore, "get").mockReturnValue("test script contents");
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <FileContext.Provider value={fileContextStore}>
          <ScriptDetails id={1} />
        </FileContext.Provider>
      </MemoryRouter>,
      { state }
    );

    expect(screen.getByText("test script contents")).toBeInTheDocument();
  });

  it("displays a collapse button if 'isCollapsible' prop is provided", () => {
    jest.spyOn(fileContextStore, "get").mockReturnValue("some random text");
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <FileContext.Provider value={fileContextStore}>
          <ScriptDetails id={1} isCollapsible />
        </FileContext.Provider>
      </MemoryRouter>,
      { state }
    );

    expect(
      screen.getByRole("button", { name: /hide details/i })
    ).toBeInTheDocument();
  });

  it("doesn't display a collapse button if 'isCollapsible' prop is not provided", () => {
    jest.spyOn(fileContextStore, "get").mockReturnValue("some random text");
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <FileContext.Provider value={fileContextStore}>
          <ScriptDetails id={1} />
        </FileContext.Provider>
      </MemoryRouter>,
      { state }
    );

    expect(screen.queryByRole("button", { name: /hide details/i })).toBeNull();
  });
});
