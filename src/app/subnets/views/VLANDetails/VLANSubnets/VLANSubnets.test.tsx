import { render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import VLANSubnets from "./VLANSubnets";

import urls from "app/base/urls";
import {
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  subnetStatistics as subnetStatisticsFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("renders correct details", () => {
  const vlan = vlanFactory({ id: 5005 });
  const subnet = subnetFactory({
    allow_dns: true,
    allow_proxy: false,
    managed: true,
    statistics: subnetStatisticsFactory({ usage_string: "25%" }),
    vlan: vlan.id,
  });
  const state = rootStateFactory({
    subnet: subnetStateFactory({ items: [subnet] }),
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <VLANSubnets id={vlan.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const vlanSubnetsTable = within(
    screen.getByRole("region", {
      name: "Subnets on this VLAN",
    })
  ).getByRole("grid");

  expect(within(vlanSubnetsTable).getByRole("link")).toHaveAttribute(
    "href",
    urls.subnets.subnet.index({ id: subnet.id })
  );
  expect(within(vlanSubnetsTable).getByLabelText("Usage").textContent).toBe(
    subnet.statistics.usage_string
  );
  expect(
    within(vlanSubnetsTable).getByLabelText("Managed allocation").textContent
  ).toBe("Yes");
  expect(
    within(vlanSubnetsTable).getByLabelText("Proxy access").textContent
  ).toBe("No");
  expect(
    within(vlanSubnetsTable).getByLabelText("Allows DNS resolution").textContent
  ).toBe("Yes");
});
