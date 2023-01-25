import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import SpaceSummaryForm from "./SpaceSummaryForm";

import { actions as spaceActions } from "app/store/space";
import {
  space as spaceFactory,
  spaceState as spaceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { userEvent, render, screen, within, waitFor } from "testing/utils";

const getRootState = () =>
  rootStateFactory({
    space: spaceStateFactory({
      items: [
        spaceFactory({
          name: "outer",
          description: "The cold, dark, emptiness of space.",
        }),
      ],
      loading: false,
    }),
  });

it("dispatches an update action on submit", async () => {
  const space = spaceFactory({
    name: "outer",
    description: "The cold, dark, emptiness of space.",
  });
  const state = getRootState();
  state.space.items = [space];
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <SpaceSummaryForm handleDismiss={jest.fn()} space={space} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const spaceSummaryForm = screen.getByRole("form", {
    name: "Edit space summary",
  });
  await userEvent.clear(screen.getByLabelText("Name"));
  await userEvent.clear(screen.getByLabelText("Description"));
  await userEvent.type(screen.getByLabelText("Name"), "new name");
  await userEvent.type(screen.getByLabelText("Description"), "new description");
  await userEvent.click(
    within(spaceSummaryForm).getByRole("button", { name: "Save" })
  );

  await waitFor(() =>
    expect(store.getActions()).toStrictEqual([
      spaceActions.update({
        id: space.id,
        name: "new name",
        description: "new description",
      }),
    ])
  );
});
