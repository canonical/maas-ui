import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import VLANSubnets from "./VLANSubnets";

import urls from "@/app/base/urls";
import * as factory from "@/testing/factories";
import { render, screen, within } from "@/testing/utils";

const mockStore = configureStore();

it("renders correct details", () => {
  const vlan = factory.vlan({ id: 5005, subnet_ids: [1] });
  const subnet = factory.subnet({
    allow_dns: true,
    allow_proxy: false,
    managed: true,
    statistics: factory.subnetStatistics({ usage_string: "25%" }),
    vlan: vlan.id,
    id: 1,
  });
  const state = factory.rootState({
    subnet: factory.subnetState({ items: [subnet] }),
    vlan: factory.vlanState({ items: [vlan] }),
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
