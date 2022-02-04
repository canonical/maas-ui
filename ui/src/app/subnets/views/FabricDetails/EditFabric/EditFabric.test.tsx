import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import EditFabric from "./EditFabric";

import { actions as fabricActions } from "app/store/fabric";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

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
      <EditFabric id={fabric.id} close={jest.fn()} />
    </Provider>
  );
  const EditSummaryForm = screen.getByRole("form", {
    name: "Edit fabric summary",
  });
  userEvent.clear(screen.getByLabelText("Name"));
  userEvent.clear(screen.getByLabelText("Description"));
  userEvent.type(screen.getByLabelText("Name"), "new name");
  userEvent.type(screen.getByLabelText("Description"), "new description");
  userEvent.click(
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
