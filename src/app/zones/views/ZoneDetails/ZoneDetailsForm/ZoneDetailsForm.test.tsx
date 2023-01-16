import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ZoneDetailsForm from "./ZoneDetailsForm";

import type { RootState } from "app/store/root/types";
import { actions as zoneActions } from "app/store/zone";
import {
  zone as zoneFactory,
  zoneState as zoneStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen, waitFor } from "testing/utils";

const mockStore = configureStore();

describe("ZoneDetailsForm", () => {
  const testZone = zoneFactory();
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      zone: zoneStateFactory({
        items: [testZone],
      }),
    });
  });

  it("runs closeForm function when the cancel button is clicked", async () => {
    const closeForm = jest.fn();
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ZoneDetailsForm closeForm={closeForm} id={testZone.id} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls actions.update on save click", async () => {
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ZoneDetailsForm closeForm={jest.fn()} id={testZone.id} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.clear(screen.getByLabelText("Name"));

    await userEvent.clear(screen.getByLabelText("Description"));

    await userEvent.type(
      screen.getByRole("textbox", { name: /name/i }),
      "test name 2"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /description/i }),
      "test description 2"
    );

    await userEvent.click(screen.getByRole("button", { name: /Update AZ/i }));

    const expectedAction = zoneActions.update({
      id: testZone.id,
      description: "test description 2",
      name: "test name 2",
    });

    await waitFor(() =>
      expect(
        store.getActions().find((action) => action.type === expectedAction.type)
      ).toStrictEqual(expectedAction)
    );
  });
});
