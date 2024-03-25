import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import VLANDeleteForm from "./VLANDeleteForm";

import { vlanActions } from "@/app/store/vlan";
import * as factory from "@/testing/factories";
import { userEvent, render, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();

it("does not allow deletion if the VLAN is the default VLAN in its fabric", () => {
  const vlan = factory.vlan({ id: 1, fabric: 2 });
  const fabric = factory.fabric({
    default_vlan_id: vlan.id,
    id: 2,
    vlan_ids: [vlan.id],
  });
  const state = factory.rootState({
    fabric: factory.fabricState({
      items: [fabric],
    }),
    vlan: factory.vlanState({
      items: [vlan],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <VLANDeleteForm closeForm={vi.fn()} id={vlan.id} />
        </CompatRouter>
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
  const vlan = factory.vlan({ id: 1, fabric: 2 });
  const fabric = factory.fabric({
    default_vlan_id: 22,
    id: 2,
    vlan_ids: [22, 33],
  });
  const state = factory.rootState({
    fabric: factory.fabricState({
      items: [fabric],
    }),
    vlan: factory.vlanState({
      items: [vlan],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <VLANDeleteForm closeForm={vi.fn()} id={vlan.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByText("Are you sure you want to delete this VLAN?")
  ).toBeInTheDocument();
});

it("deletes the VLAN when confirmed", async () => {
  const vlan = factory.vlan({ id: 1, fabric: 2 });
  const fabric = factory.fabric({
    default_vlan_id: 22,
    id: 2,
    vlan_ids: [22, 33],
  });
  const state = factory.rootState({
    fabric: factory.fabricState({
      items: [fabric],
    }),
    vlan: factory.vlanState({
      items: [vlan],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <VLANDeleteForm closeForm={vi.fn()} id={vlan.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(screen.getByRole("button", { name: "Delete VLAN" }));

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
