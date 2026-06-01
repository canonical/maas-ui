import DeleteScript from "./DeleteScript";

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

describe("DeleteScript", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      script: factory.scriptState({
        loaded: true,
        items: [
          factory.script({
            id: 1,
            name: "commissioning-script",
            script_type: ScriptType.COMMISSIONING,
          }),
        ],
      }),
    });
  });

  it("renders the delete confirmation form when the script exists", () => {
    renderWithProviders(<DeleteScript id={1} />, { state });

    expect(
      screen.getByRole("form", { name: "Confirm script deletion" })
    ).toBeInTheDocument();
    expect(screen.getByText(/commissioning-script/)).toBeInTheDocument();
  });

  it("renders a not-found message when the script does not exist", () => {
    renderWithProviders(<DeleteScript id={99} />, { state });

    expect(screen.getByText("Script could not be found.")).toBeInTheDocument();
    expect(
      screen.queryByRole("form", { name: "Confirm script deletion" })
    ).not.toBeInTheDocument();
  });

  it("closes the side panel when Close is clicked on the not-found message", async () => {
    renderWithProviders(<DeleteScript id={99} />, { state });

    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(mockClose).toHaveBeenCalled();
  });
});
