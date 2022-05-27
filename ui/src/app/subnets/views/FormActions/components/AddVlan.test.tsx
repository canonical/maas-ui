import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import AddVlan from "./AddVlan";

import { actions as vlanActions } from "app/store/vlan";
import {
  space as spaceFactory,
  fabric as fabricFactory,
  spaceState as spaceStateFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

it("displays validation messages for VID", async () => {
  const store = configureStore()(rootStateFactory());

  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <AddVlan activeForm="VLAN" setActiveForm={() => undefined} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  const VidTextBox = screen.getByRole("textbox", { name: /VID/ });
  const submitButton = screen.getByRole("button", { name: "Add VLAN" });
  const errorMessage = /must be a numeric value/;

  await userEvent.type(VidTextBox, "abc");
  await userEvent.click(submitButton);

  await waitFor(() =>
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  );

  await userEvent.clear(VidTextBox);
  await userEvent.type(VidTextBox, "123");

  await waitFor(() =>
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument()
  );

  await userEvent.clear(VidTextBox);
  await userEvent.type(VidTextBox, "99999");

  await waitFor(() =>
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  );
});

it("correctly dispatches VLAN cleanup and create actions on form submit", async () => {
  const vid = 123;
  const name = "VLAN name";
  const space = { id: 1, name: "space1" };
  const fabric = { id: 1, name: "fabric1" };

  const state = rootStateFactory({
    space: spaceStateFactory({
      items: [spaceFactory(space)],
      loaded: true,
    }),
    fabric: fabricStateFactory({
      items: [fabricFactory(fabric)],
      loaded: true,
    }),
  });
  const store = configureStore()(state);

  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <AddVlan activeForm="VLAN" setActiveForm={() => undefined} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.type(screen.getByRole("textbox", { name: /VID/ }), `${vid}`);
  await userEvent.type(
    screen.getByRole("textbox", { name: /Name/ }),
    `${name}`
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Fabric" }),
    fabric.name
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Space" }),
    space.name
  );

  await userEvent.click(screen.getByRole("button", { name: "Add VLAN" }));

  const expectedActions = [
    vlanActions.cleanup(),
    vlanActions.create({
      vid,
      name,
      fabric: fabric.id,
      space: space.id,
    }),
  ];
  await waitFor(() => {
    const actualActions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(
        actualActions.find(({ type }) => type === expectedAction.type)
      ).toStrictEqual(expectedAction);
    });
  });
});
