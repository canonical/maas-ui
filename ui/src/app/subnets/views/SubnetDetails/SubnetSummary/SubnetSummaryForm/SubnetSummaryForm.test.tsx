import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SubnetSummaryForm from "./SubnetSummaryForm";

import { actions as subnetActions } from "app/store/subnet";
import {
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
} from "testing/factories";

const subnet = {
  id: 1,
  name: "Test subnet",
  cidr: "192.168.1.1/32",
  gateway_ip: "192.168.1.1/32",
  dns_servers: "Test DNS",
  description: "Test description",
  managed: true,
  active_discovery: true,
  allow_proxy: true,
  allow_dns: true,
  space: 1,
  vlan: 1,
};

const getRootState = () =>
  rootStateFactory({
    subnet: subnetStateFactory({
      loaded: true,
      loading: false,
      items: [subnetFactory(subnet)],
    }),
    vlan: vlanStateFactory({
      loaded: true,
      loading: false,
      items: [
        vlanFactory({
          id: subnet.vlan,
          name: "Test VLAN",
          fabric: 1,
        }),
      ],
    }),
    fabric: fabricStateFactory({
      loaded: true,
      loading: false,
      items: [
        fabricFactory({
          id: 1,
          name: "Test fabric",
          vlan_ids: [subnet.vlan],
        }),
      ],
    }),
  });

it("dispatches an update action on submit", async () => {
  const state = getRootState();
  const store = configureStore()(state);

  render(
    <Provider store={store}>
      <SubnetSummaryForm id={subnet.id} handleDismiss={jest.fn()} />
    </Provider>
  );

  const subnetSummaryForm = screen.getByRole("form", {
    name: "Edit subnet summary",
  });

  userEvent.clear(screen.getByLabelText("Name"));
  userEvent.clear(screen.getByLabelText("Description"));
  userEvent.type(screen.getByLabelText("Name"), "Test name updated");
  userEvent.type(
    screen.getByLabelText("Description"),
    "Test description updated"
  );
  userEvent.click(
    within(subnetSummaryForm).getByRole("button", { name: "Save" })
  );

  await waitFor(() => {
    const expectedActions = [
      subnetActions.update({
        ...subnet,
        name: "Test name updated",
        description: "Test description updated",
      }),
      subnetActions.cleanup(),
    ];

    const actualActions = store.getActions();

    expectedActions.forEach((expectedAction) => {
      expect(
        actualActions.find(
          (actualAction) =>
            actualAction.type === expectedAction.type &&
            // Check payload to differentiate "set" and "unset" active actions
            actualAction.payload?.params === expectedAction.payload?.params
        )
      ).toStrictEqual(expectedAction);
    });
  });
});
