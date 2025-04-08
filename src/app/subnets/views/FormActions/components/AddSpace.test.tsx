import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import AddSpace from "./AddSpace";

import { spaceActions } from "@/app/store/space";
import * as factory from "@/testing/factories";
import { userEvent, render, screen, waitFor } from "@/testing/utils";

test("correctly dispatches space cleanup and create actions on form submit", async () => {
  const store = configureStore()(factory.rootState());

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

  await userEvent.type(screen.getByRole("textbox", { name: /Name/ }), name);
  await userEvent.click(screen.getByRole("button", { name: /Add Space/ }));

  await waitFor(() =>
    expect(store.getActions()).toStrictEqual([
      spaceActions.cleanup(),
      spaceActions.create({ name }),
    ])
  );
});
