import configureStore from "redux-mock-store";

import AddZone from "./AddZone";

import type { RootState } from "@/app/store/root/types";
import { zoneActions } from "@/app/store/zone";
import * as factory from "@/testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "@/testing/utils";

const mockStore = configureStore();

describe("AddZone", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState();
  });

  it("runs closeForm function when the cancel button is clicked", async () => {
    const closeForm = vi.fn();
    const store = mockStore(state);
    renderWithBrowserRouter(<AddZone closeForm={vi.fn()} />, {
      store,
    });

    await userEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls actions.create on save click", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<AddZone closeForm={vi.fn()} />, {
      store,
    });

    await userEvent.type(
      screen.getByRole("textbox", { name: /name/i }),
      "test-zone"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /description/i }),
      "desc"
    );

    await userEvent.click(screen.getByRole("button", { name: /Add AZ/i }));

    const expectedAction = zoneActions.create({
      description: "desc",
      name: "test-zone",
    });

    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
