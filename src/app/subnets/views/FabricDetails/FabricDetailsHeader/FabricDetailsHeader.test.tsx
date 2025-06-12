import { waitFor } from "@testing-library/react";

import FabricDetailsHeader from "./FabricDetailsHeader";
import { FabricDetailsSidePanelViews } from "./constants";

import type { Fabric } from "@/app/store/fabric/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
} from "@/testing/utils";

let state: RootState;
let fabric: Fabric;

setupMockServer(authResolvers.getCurrentUser.handler());

describe("FabricDetailsHeader", () => {
  beforeEach(() => {
    fabric = factory.fabric({ id: 1, name: "fabric1" });
    state = factory.rootState({
      fabric: factory.fabricState({
        items: [fabric],
      }),
    });
  });

  it("shows the delete button when the user is an admin", async () => {
    renderWithProviders(
      <FabricDetailsHeader fabric={fabric} setSidePanelContent={vi.fn()} />,
      {
        initialEntries: ["/fabric/1"],
        state,
      }
    );

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Delete fabric" })
      ).toBeInTheDocument()
    );
  });

  it("does not show the delete button if the user is not an admin", () => {
    renderWithProviders(
      <FabricDetailsHeader fabric={fabric} setSidePanelContent={vi.fn()} />,
      {
        initialEntries: ["/fabric/1"],
        state,
      }
    );

    expect(screen.queryByRole("button", { name: "Delete fabric" })).toBeNull();
  });

  it("calls a function to open the Delete form when the button is clicked", async () => {
    const setSidePanelContent = vi.fn();
    renderWithProviders(
      <FabricDetailsHeader
        fabric={fabric}
        setSidePanelContent={setSidePanelContent}
      />,
      {
        initialEntries: ["/fabric/1"],
        state,
      }
    );

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Delete fabric" })
      ).toBeInTheDocument()
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Delete fabric" })
    );

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: FabricDetailsSidePanelViews.DELETE_FABRIC,
    });
  });
});
