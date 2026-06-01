import ScriptDetails from ".";

import FileContext, { fileContextStore } from "@/app/base/file-context";
import type { RootState } from "@/app/store/root/types";
import { ScriptType } from "@/app/store/script/types";
import * as factory from "@/testing/factories";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  userEvent,
} from "@/testing/utils";

const { mockClose } = await mockSidePanel();

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
    const { store } = renderWithProviders(<ScriptDetails id={1} />, { state });
    expect(
      store.getActions().some((action) => action.type === "script/get")
    ).toBe(true);
  });

  it("displays a spinner while loading", () => {
    state.script.loading = true;
    renderWithProviders(<ScriptDetails id={1} />, { state });
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("displays a message when the script does not exist", () => {
    renderWithProviders(<ScriptDetails id={1} />, { state });
    expect(screen.getByText("Script could not be found")).toBeInTheDocument();
  });

  it("can display the script", () => {
    vi.spyOn(fileContextStore, "get").mockReturnValue("test script contents");
    renderWithProviders(
      <FileContext.Provider value={fileContextStore}>
        <ScriptDetails id={1} />
      </FileContext.Provider>,
      { state }
    );

    expect(screen.getByText("test script contents")).toBeInTheDocument();
  });

  it("closes the side panel when Close is clicked", async () => {
    vi.spyOn(fileContextStore, "get").mockReturnValue("test script contents");
    renderWithProviders(
      <FileContext.Provider value={fileContextStore}>
        <ScriptDetails id={1} />
      </FileContext.Provider>,
      { state }
    );

    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(mockClose).toHaveBeenCalled();
  });
});
