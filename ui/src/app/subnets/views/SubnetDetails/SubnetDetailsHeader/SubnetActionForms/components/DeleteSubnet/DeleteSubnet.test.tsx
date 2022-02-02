import { render, screen, within } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { Router, Route } from "react-router";
import configureStore from "redux-mock-store";

import DeleteSubnet from "./DeleteSubnet";

import subnetsURLs from "app/subnets/urls";
import {
  subnetDetails as subnetFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  vlan as vlanFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const renderTestCase = (
  vlan = vlanFactory({
    id: 1,
    dhcp_on: true,
  }),
  subnet = subnetFactory({
    id: 1,
    vlan: 1,
  })
) => {
  const history = createMemoryHistory({
    initialEntries: [{ pathname: subnetsURLs.subnet.index({ id: subnet.id }) }],
  });
  const state = rootStateFactory({
    subnet: subnetStateFactory({
      items: [subnet],
      loading: false,
      loaded: true,
    }),
    vlan: vlanStateFactory({
      items: [vlan],
      loading: false,
      loaded: true,
    }),
  });
  const store = configureStore()(state);
  return {
    history,
    store,
    ...render(
      <Provider store={store}>
        <Router history={history}>
          <Route
            exact
            path={subnetsURLs.subnet.index({ id: subnet.id })}
            component={() => <DeleteSubnet setActiveForm={jest.fn()} />}
          />
        </Router>
      </Provider>
    ),
  };
};

it("displays a correct error message for a subnet with IPs obtained through DHCP", () => {
  renderTestCase();
  const deleteSubnetSection = screen.getByRole("region", {
    name: /Delete subnet?/i,
  });

  expect(
    within(deleteSubnetSection).getByText(
      /This subnet cannot be deleted as there are nodes that have an IP address obtained through DHCP services on this subnet./
    )
  ).toBeInTheDocument();
});
