import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import FabricDeleteForm from "./FabricDeleteForm";

import { actions as fabricActions } from "app/store/fabric";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";
import { render, screen, waitFor } from "testing/utils";

const mockStore = configureStore();

it("does not allow deletion if the fabric is the default fabric", () => {
  const fabric = fabricFactory({ id: 0 });
  const state = rootStateFactory({
    fabric: fabricStateFactory({
      items: [fabric],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FabricDeleteForm closeForm={jest.fn()} id={fabric.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByText(
      "This fabric cannot be deleted because it is the default fabric for this MAAS."
    )
  ).toBeInTheDocument();
});

it("does not allow deletion if the fabric has subnets attached", () => {
  const subnet = subnetFactory({ vlan: 101 });
  const fabric = fabricFactory({ id: 1, vlan_ids: [subnet.vlan] });
  const state = rootStateFactory({
    fabric: fabricStateFactory({
      items: [fabric],
    }),
    subnet: subnetStateFactory({
      items: [subnet],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FabricDeleteForm closeForm={jest.fn()} id={fabric.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByText(
      "This fabric cannot be deleted because it has subnets attached. Remove all subnets from the VLANs on this fabric to allow deletion."
    )
  ).toBeInTheDocument();
});

it(`displays a delete confirmation if the fabric is not the default and has no
    subnets attached`, () => {
  const fabric = fabricFactory({ id: 1 });
  const state = rootStateFactory({
    fabric: fabricStateFactory({ items: [fabric] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FabricDeleteForm closeForm={jest.fn()} id={fabric.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByText("Are you sure you want to delete this fabric?")
  ).toBeInTheDocument();
});

it("deletes the fabric when confirmed", async () => {
  const fabric = fabricFactory({ id: 1 });
  const state = rootStateFactory({
    fabric: fabricStateFactory({ items: [fabric] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FabricDeleteForm closeForm={jest.fn()} id={fabric.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(screen.getByRole("button", { name: "Delete fabric" }));

  const expectedActions = [fabricActions.delete(fabric.id)];
  const actualActions = store.getActions();
  await waitFor(() =>
    expectedActions.forEach((expectedAction) => {
      expect(
        actualActions.find(
          (actualAction) => actualAction.type === expectedAction.type
        )
      ).toStrictEqual(expectedAction);
    })
  );
});
