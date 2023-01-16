import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ZonesListForm from "./ZonesListForm";

import type { RootState } from "app/store/root/types";
import { actions as zoneActions } from "app/store/zone";
import { rootState as rootStateFactory } from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();

describe("ZonesListForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("runs closeForm function when the cancel button is clicked", async () => {
    const closeForm = jest.fn();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ZonesListForm closeForm={closeForm} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls actions.create on save click", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ZonesListForm closeForm={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

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
