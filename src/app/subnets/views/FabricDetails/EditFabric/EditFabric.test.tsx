import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import EditFabric from "./EditFabric";

import { actions as fabricActions } from "app/store/fabric";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen, within, waitFor } from "testing/utils";

const getRootState = () =>
  rootStateFactory({
    fabric: fabricStateFactory({
      items: [
        fabricFactory({
          name: "fabric-1",
          description: "fabric-1 description",
        }),
      ],
      loading: false,
    }),
  });

it("dispatches an update action on submit", async () => {
  const fabric = fabricFactory({
    name: "fabric-1",
    description: "fabric-1 description",
  });
  const state = getRootState();
  state.fabric.items = [fabric];
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <EditFabric close={jest.fn()} id={fabric.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const EditSummaryForm = screen.getByRole("form", {
    name: "Edit fabric summary",
  });
  await userEvent.clear(screen.getByLabelText("Name"));
  await userEvent.clear(screen.getByLabelText("Description"));
  await userEvent.type(screen.getByLabelText("Name"), "new name");
  await userEvent.type(screen.getByLabelText("Description"), "new description");
  await userEvent.click(
    within(EditSummaryForm).getByRole("button", { name: "Save summary" })
  );

  const expectedAction = fabricActions.update({
    id: fabric.id,
    name: "new name",
    description: "new description",
  });
  await waitFor(() => {
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
