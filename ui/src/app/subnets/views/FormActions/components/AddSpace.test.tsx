import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddSpace from "./AddSpace";

import { actions as spaceActions } from "app/store/space";
import { rootState as rootStateFactory } from "testing/factories";

test("correctly dispatches space cleanup and create actions on form submit", async () => {
  const store = configureStore()(rootStateFactory());

  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/networks", key: "testKey" }]}
      >
        <AddSpace activeForm="Space" setActiveForm={() => undefined} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();

  const name = "Space name";

  userEvent.type(screen.getByRole("textbox", { name: /Name/ }), name);
  userEvent.click(screen.getByRole("button", { name: /Add Space/ }));

  await waitFor(() =>
    expect(store.getActions()).toStrictEqual([
      spaceActions.cleanup(),
      spaceActions.create({ name }),
    ])
  );
});
