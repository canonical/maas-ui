import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import VLANDeleteForm from "./VLANDeleteForm";

import { actions as vlanActions } from "app/store/vlan";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("does not allow deletion if the VLAN is the default VLAN in its fabric", () => {
  const vlan = vlanFactory({ id: 1, fabric: 2 });
  const fabric = fabricFactory({
    default_vlan_id: vlan.id,
    id: 2,
    vlan_ids: [vlan.id],
  });
  const state = rootStateFactory({
    fabric: fabricStateFactory({
      items: [fabric],
    }),
    vlan: vlanStateFactory({
      items: [vlan],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <VLANDeleteForm closeForm={jest.fn()} id={vlan.id} />
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByText(
      /This VLAN cannot be deleted because it is the default VLAN/i
    )
  ).toBeInTheDocument();
});

it("displays a delete confirmation if the VLAN is not the default for its fabric", () => {
  const vlan = vlanFactory({ id: 1, fabric: 2 });
  const fabric = fabricFactory({
    default_vlan_id: 22,
    id: 2,
    vlan_ids: [22, 33],
  });
  const state = rootStateFactory({
    fabric: fabricStateFactory({
      items: [fabric],
    }),
    vlan: vlanStateFactory({
      items: [vlan],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <VLANDeleteForm closeForm={jest.fn()} id={vlan.id} />
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByText("Are you sure you want to delete this VLAN?")
  ).toBeInTheDocument();
});

it("deletes the VLAN when confirmed", async () => {
  const vlan = vlanFactory({ id: 1, fabric: 2 });
  const fabric = fabricFactory({
    default_vlan_id: 22,
    id: 2,
    vlan_ids: [22, 33],
  });
  const state = rootStateFactory({
    fabric: fabricStateFactory({
      items: [fabric],
    }),
    vlan: vlanStateFactory({
      items: [vlan],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <VLANDeleteForm closeForm={jest.fn()} id={vlan.id} />
      </MemoryRouter>
    </Provider>
  );

  userEvent.click(screen.getByRole("button", { name: "Delete VLAN" }));

  const expectedActions = [vlanActions.delete(vlan.id)];
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
