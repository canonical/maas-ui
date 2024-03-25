import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { Labels as ScriptsListLabels } from "./ScriptsList";

import ScriptsList from ".";

import { fileContextStore } from "@/app/base/file-context";
import type { RootState } from "@/app/store/root/types";
import { ScriptType } from "@/app/store/script/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  within,
  renderWithMockStore,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore();

describe("ScriptsList", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

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
          factory.script({
            id: 2,
            name: "testing-script",
            description: "a testing script",
            script_type: ScriptType.TESTING,
          }),
          factory.script({
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

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <CompatRouter>
            <ScriptsList />
          </CompatRouter>
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

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <CompatRouter>
            <ScriptsList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "script/fetch")
    ).toBe(false);
  });

  it("Displays commissioning scripts by default", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ScriptsList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(screen.getAllByTestId("script-row")).toHaveLength(1);

    const commissioning_script = screen.getByRole("row", {
      name: "commissioning-script",
    });

    expect(commissioning_script).toBeInTheDocument();
    expect(
      within(commissioning_script).getByRole("gridcell", {
        name: "a commissioning script",
      })
    ).toBeInTheDocument();
  });

  it("Displays testing scripts", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ScriptsList type="testing" />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(screen.getAllByTestId("script-row")).toHaveLength(2);

    const testing_script = screen.getByRole("row", {
      name: "testing-script",
    });

    const another_testing_script = screen.getByRole("row", {
      name: "testing-script-2",
    });

    expect(testing_script).toBeInTheDocument();
    expect(
      within(testing_script).getByRole("gridcell", {
        name: "a testing script",
      })
    ).toBeInTheDocument();

    expect(another_testing_script).toBeInTheDocument();
    expect(
      within(another_testing_script).getByRole("gridcell", {
        name: "another testing script",
      })
    ).toBeInTheDocument();
  });

  it("can show a delete confirmation", async () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ScriptsList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    let row = screen.getByRole("row", { name: "commissioning-script" });
    expect(row).not.toHaveClass("is-active");
    // Click on the delete button:
    await userEvent.click(
      within(within(row).getByLabelText(ScriptsListLabels.Actions)).getByRole(
        "button",
        { name: "Delete" }
      )
    );
    row = screen.getByRole("row", { name: "commissioning-script" });
    expect(row).toHaveClass("is-active");
  });

  it("disables the delete button if a default script", () => {
    const state = factory.rootState({
      script: factory.scriptState({
        loaded: true,
        items: [
          factory.script({
            default: true,
            script_type: ScriptType.TESTING,
          }),
          factory.script({
            default: false,
            script_type: ScriptType.TESTING,
          }),
        ],
      }),
    });

    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ScriptsList type="testing" />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(
      within(
        within(screen.getByRole("row", { name: "test name 19" })).getByRole(
          "gridcell",
          { name: ScriptsListLabels.Actions }
        )
      ).getByRole("button")
    ).toBeDisabled();

    expect(
      within(
        within(screen.getByRole("row", { name: "test name 20" })).getByRole(
          "gridcell",
          { name: ScriptsListLabels.Actions }
        )
      ).getByRole("button")
    ).not.toBeDisabled();
  });

  it("can delete a script", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <CompatRouter>
            <ScriptsList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    let row = screen.getByRole("row", { name: "commissioning-script" });
    expect(row).not.toHaveClass("is-active");
    // Click on the delete button:
    await userEvent.click(
      within(within(row).getByLabelText(ScriptsListLabels.Actions)).getByRole(
        "button",
        { name: "Delete" }
      )
    );
    // Click on the delete confirm button
    await userEvent.click(
      within(
        within(row).getByLabelText(ScriptsListLabels.DeleteConfirm)
      ).getByRole("button", { name: "Delete" })
    );

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

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <CompatRouter>
            <ScriptsList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "script/cleanup")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });

  it("can show script source", async () => {
    vi.spyOn(fileContextStore, "get").mockReturnValue("test script contents");

    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ScriptsList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    let row = screen.getByRole("row", { name: "commissioning-script" });
    expect(row).not.toHaveClass("is-active");

    // Click on the expand button:
    await userEvent.click(
      within(row).getByRole("button", { name: "Show/hide details" })
    );
    row = screen.getByRole("row", { name: "commissioning-script" });
    expect(row).toHaveClass("is-active");

    // expect script source to be decoded base64
    expect(screen.getByText("test script contents")).toBeInTheDocument();
  });

  it("correctly formats script creation date", () => {
    const state = factory.rootState({
      script: factory.scriptState({
        loaded: true,
        items: [
          factory.script({
            created: "Thu, 31 Dec. 2020 22:59:00",
            script_type: ScriptType.TESTING,
          }),
        ],
      }),
    });

    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ScriptsList type="testing" />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(
      within(screen.getByRole("row", { name: "test name 33" })).getByText(
        "2020-12-31 22:59"
      )
    ).toBeInTheDocument();
  });

  it("formats script creation date as 'Never' if date cannot be parsed", () => {
    const state = factory.rootState({
      script: factory.scriptState({
        loaded: true,
        items: [
          factory.script({
            created: "",
            script_type: ScriptType.TESTING,
          }),
        ],
      }),
    });

    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ScriptsList type="testing" />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(
      within(screen.getByRole("row", { name: "test name 37" })).getByText(
        "Never"
      )
    ).toBeInTheDocument();
  });

  it("displays a message if there are no scripts", () => {
    const state = factory.rootState({
      script: factory.scriptState({
        loaded: true,
        items: [],
      }),
    });

    renderWithBrowserRouter(<ScriptsList type="testing" />, {
      state,
      route: "/",
    });

    expect(screen.getByText(ScriptsListLabels.EmptyList)).toBeInTheDocument();
  });
});
