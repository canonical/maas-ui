import FabricDetailsHeader from "./FabricDetailsHeader";
import { FabricDetailsSidePanelViews } from "./constants";

import type { Fabric } from "@/app/store/fabric/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

let state: RootState;
let fabric: Fabric;

describe("FabricDetailsHeader", () => {
  beforeEach(() => {
    fabric = factory.fabric({ id: 1, name: "fabric1" });
    state = factory.rootState({
      fabric: factory.fabricState({
        items: [fabric],
      }),
    });
  });

  it("shows the delete button when the user is an admin", () => {
    state.user = factory.userState({
      auth: factory.authState({
        user: factory.user({ is_superuser: true }),
      }),
    });
    renderWithBrowserRouter(
      <FabricDetailsHeader fabric={fabric} setSidePanelContent={vi.fn()} />,
      {
        route: "/fabric/1",
        state,
      }
    );

    expect(
      screen.getByRole("button", { name: "Delete fabric" })
    ).toBeInTheDocument();
  });

  it("does not show the delete button if the user is not an admin", () => {
    state.user = factory.userState({
      auth: factory.authState({
        user: factory.user({ is_superuser: false }),
      }),
    });
    renderWithBrowserRouter(
      <FabricDetailsHeader fabric={fabric} setSidePanelContent={vi.fn()} />,
      {
        route: "/fabric/1",
        state,
      }
    );

    expect(screen.queryByRole("button", { name: "Delete fabric" })).toBeNull();
  });

  it("calls a function to open the Delete form when the button is clicked", async () => {
    const setSidePanelContent = vi.fn();
    state.user = factory.userState({
      auth: factory.authState({
        user: factory.user({ is_superuser: true }),
      }),
    });
    renderWithBrowserRouter(
      <FabricDetailsHeader
        fabric={fabric}
        setSidePanelContent={setSidePanelContent}
      />,
      {
        route: "/fabric/1",
        state,
      }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Delete fabric" })
    );

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: FabricDetailsSidePanelViews.DELETE_FABRIC,
    });
  });
});
