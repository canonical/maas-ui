import { Labels as ScriptsListLabels } from "./ScriptsList";

import ScriptsList from ".";

import ScriptDetails from "@/app/settings/views/Scripts/ScriptDetails";
import DeleteScript from "@/app/settings/views/Scripts/ScriptsList/components/DeleteScript/DeleteScript";
import type { RootState } from "@/app/store/root/types";
import { ScriptType } from "@/app/store/script/types";
import * as factory from "@/testing/factories";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  userEvent,
  within,
} from "@/testing/utils";

const { mockOpen } = await mockSidePanel();

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
          factory.script({
            id: 4,
            name: "deployment-script",
            description: "a deployment script",
            script_type: ScriptType.DEPLOYMENT,
          }),
        ],
      }),
    });
  });

  it("fetches scripts if they haven't been loaded yet", () => {
    state.script.loaded = false;
    const { store } = renderWithProviders(<ScriptsList />, { state });
    expect(
      store.getActions().some((action) => action.type === "script/fetch")
    ).toBe(true);
  });

  it("does not fetch scripts if they've already been loaded", () => {
    state.script.loaded = true;
    const { store } = renderWithProviders(<ScriptsList />, { state });

    expect(
      store.getActions().some((action) => action.type === "script/fetch")
    ).toBe(false);
  });

  it("Displays commissioning scripts by default", () => {
    renderWithProviders(<ScriptsList />, { state });

    expect(
      screen.getByRole("row", { name: /commissioning-script/ })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("row", { name: /^testing-script/ })
    ).not.toBeInTheDocument();
  });

  it("Displays testing scripts", () => {
    renderWithProviders(<ScriptsList type="testing" />, { state });

    expect(
      screen.getByRole("row", { name: /^testing-script / })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", { name: /testing-script-2/ })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("row", { name: /commissioning-script/ })
    ).not.toBeInTheDocument();
  });

  it("Displays deployment scripts", () => {
    renderWithProviders(<ScriptsList type="deployment" />, { state });

    expect(
      screen.getByRole("row", { name: /deployment-script/ })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("row", { name: /commissioning-script/ })
    ).not.toBeInTheDocument();
  });

  it("opens the delete script side panel when delete is clicked", async () => {
    renderWithProviders(<ScriptsList />, { state });

    const row = screen.getByRole("row", { name: /commissioning-script/ });
    await userEvent.click(within(row).getByRole("button", { name: "Delete" }));

    expect(mockOpen).toHaveBeenCalledWith(
      expect.objectContaining({
        component: DeleteScript,
        title: "Delete script",
        props: { id: 1 },
      })
    );
  });

  it("disables the delete button for default scripts", () => {
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

    renderWithProviders(<ScriptsList type="testing" />, { state });

    // getAllByRole("row") returns [header, dataRow1, dataRow2]
    const dataRows = screen.getAllByRole("row").slice(1);

    expect(
      within(dataRows[0]).getByRole("button", { name: "Delete" })
    ).toBeAriaDisabled();

    expect(
      within(dataRows[1]).getByRole("button", { name: "Delete" })
    ).not.toBeAriaDisabled();
  });

  it("opens the script details side panel when the script name is clicked", async () => {
    renderWithProviders(<ScriptsList />, { state });

    await userEvent.click(
      screen.getByRole("button", { name: "commissioning-script" })
    );

    expect(mockOpen).toHaveBeenCalledWith(
      expect.objectContaining({
        component: ScriptDetails,
        title: "Script details",
        props: { id: 1 },
      })
    );
  });

  it("displays a message if there are no scripts", () => {
    const state = factory.rootState({
      script: factory.scriptState({
        loaded: true,
        items: [],
      }),
    });

    renderWithProviders(<ScriptsList type="testing" />, { state });

    expect(screen.getByText(ScriptsListLabels.EmptyList)).toBeInTheDocument();
  });
});
