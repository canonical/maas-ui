import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import ScriptDetails from ".";

import FileContext, { fileContextStore } from "@/app/base/file-context";
import type { RootState } from "@/app/store/root/types";
import { ScriptType } from "@/app/store/script/types";
import * as factory from "@/testing/factories";
import { screen, render, renderWithBrowserRouter } from "@/testing/utils";

const mockStore = configureStore();

describe("ScriptDetails", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      script: factory.scriptState({
        loaded: true,
        items: [
          factory.script({
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
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
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
    renderWithBrowserRouter(<ScriptDetails id={1} />, { state, route: "/" });
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("displays a message when the script does not exist", () => {
    renderWithBrowserRouter(<ScriptDetails id={1} />, { state, route: "/" });
    expect(screen.getByText("Script could not be found")).toBeInTheDocument();
  });

  it("can display the script", () => {
    vi.spyOn(fileContextStore, "get").mockReturnValue("test script contents");
    renderWithBrowserRouter(
      <FileContext.Provider value={fileContextStore}>
        <ScriptDetails id={1} />
      </FileContext.Provider>,
      { state, route: "/" }
    );

    expect(screen.getByText("test script contents")).toBeInTheDocument();
  });

  it("displays a collapse button if 'isCollapsible' prop is provided", () => {
    vi.spyOn(fileContextStore, "get").mockReturnValue("some random text");
    renderWithBrowserRouter(
      <FileContext.Provider value={fileContextStore}>
        <ScriptDetails id={1} isCollapsible />
      </FileContext.Provider>,
      { state, route: "/" }
    );

    expect(
      screen.getByRole("button", { name: /close snippet/i })
    ).toBeInTheDocument();
  });

  it("doesn't display a collapse button if 'isCollapsible' prop is not provided", () => {
    vi.spyOn(fileContextStore, "get").mockReturnValue("some random text");
    renderWithBrowserRouter(
      <FileContext.Provider value={fileContextStore}>
        <ScriptDetails id={1} />
      </FileContext.Provider>,
      { state, route: "/" }
    );

    expect(
      screen.queryByRole("button", { name: /close snippet/i })
    ).not.toBeInTheDocument();
  });
});
