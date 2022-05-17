import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddFabric from "./AddFabric";

import { actions as fabricActions } from "app/store/fabric";
import { rootState as rootStateFactory } from "testing/factories";

const renderTestCase = () => {
  const store = configureStore()(rootStateFactory());
  const setActiveForm = jest.fn();

  const view = render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/networks", key: "testKey" }]}
      >
        <AddFabric activeForm="Fabric" setActiveForm={setActiveForm} />
      </MemoryRouter>
    </Provider>
  );
  return { ...view, store, props: { setActiveForm } };
};

test("renders the form correctly", async () => {
  renderTestCase();

  expect(screen.getByRole("textbox", { name: /Name/ })).toBeEnabled();
  expect(screen.getByRole("textbox", { name: /Description/ })).toBeEnabled();
  expect(screen.getByRole("button", { name: /Add Fabric/ })).toBeEnabled();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeEnabled();
  expect(screen.getByRole("button", { name: /Add Fabric/ })).toBeEnabled();
});

test("correctly dispatches fabric cleanup and create actions on submit with name provided", async () => {
  const { store } = renderTestCase();

  expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: /Add Fabric/ }));

  await waitFor(() =>
    expect(store.getActions()).toStrictEqual([
      fabricActions.cleanup(),
      fabricActions.create({ name: "", description: "" }),
    ])
  );
});

test("correctly dispatches fabric cleanup and create actions on submit with name provided", async () => {
  const { store } = renderTestCase();

  const name = "Fabric name";
  await userEvent.type(screen.getByRole("textbox", { name: /Name/ }), name);
  await userEvent.click(screen.getByRole("button", { name: /Add Fabric/ }));

  await waitFor(() =>
    expect(store.getActions()).toStrictEqual([
      fabricActions.cleanup(),
      fabricActions.create({ name, description: "" }),
    ])
  );
});

test("correctly dispatches fabric cleanup and create actions on submit with all details provided", async () => {
  const { store } = renderTestCase();

  expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();

  const name = "Fabric name";
  const description = "Description";

  await userEvent.type(screen.getByRole("textbox", { name: /Name/ }), name);
  await userEvent.type(
    screen.getByRole("textbox", { name: /Description/ }),
    description
  );
  await userEvent.click(screen.getByRole("button", { name: /Add Fabric/ }));

  await waitFor(() =>
    expect(store.getActions()).toStrictEqual([
      fabricActions.cleanup(),
      fabricActions.create({ name, description }),
    ])
  );
});
