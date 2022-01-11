import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddFabric from "./AddFabric";

import { rootState as rootStateFactory } from "testing/factories";

test("correctly dispatches fabric create action on form submit", async () => {
  const store = configureStore()(rootStateFactory());

  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/networks", key: "testKey" }]}
      >
        <AddFabric activeForm="Fabric" setActiveForm={() => undefined} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();

  const name = "Fabric name";

  userEvent.type(screen.getByRole("textbox", { name: /Name/ }), "Fabric name");
  userEvent.click(screen.getByRole("button", { name: /Add Fabric/ }));

  await waitFor(() =>
    expect(store.getActions()).toEqual([
      {
        meta: { method: "create", model: "fabric" },
        payload: { params: { name } },
        type: "fabric/create",
      },
    ])
  );
});
