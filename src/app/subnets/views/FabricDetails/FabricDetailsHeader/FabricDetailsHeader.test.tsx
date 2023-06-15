import FabricDetailsHeader from "./FabricDetailsHeader";
import { FabricDetailsViews } from "./constants";

import type { Fabric } from "app/store/fabric/types";
import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

let state: RootState;
let fabric: Fabric;

describe("FabricDetailsHeader", () => {
  beforeEach(() => {
    fabric = fabricFactory({ id: 1, name: "fabric1" });
    state = rootStateFactory({
      fabric: fabricStateFactory({
        items: [fabric],
      }),
    });
  });

  it("shows the delete button when the user is an admin", () => {
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ is_superuser: true }),
      }),
    });
    renderWithBrowserRouter(
      <FabricDetailsHeader fabric={fabric} setSidePanelContent={jest.fn()} />,
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
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ is_superuser: false }),
      }),
    });
    renderWithBrowserRouter(
      <FabricDetailsHeader fabric={fabric} setSidePanelContent={jest.fn()} />,
      {
        route: "/fabric/1",
        state,
      }
    );

    expect(screen.queryByRole("button", { name: "Delete fabric" })).toBeNull();
  });

  it("calls a function to open the Delete form when the button is clicked", async () => {
    const setSidePanelContent = jest.fn();
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ is_superuser: true }),
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
      view: FabricDetailsViews.DELETE_FABRIC,
    });
  });
});
