import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import VLANLink from "./VLANLink";

import urls from "app/base/urls";
import {
  rootState as rootStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("handles when VLANs are loading", () => {
  const state = rootStateFactory({
    vlan: vlanStateFactory({ items: [], loading: true }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <VLANLink id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByLabelText("Loading VLANs")).toBeInTheDocument();
});

it("handles when a VLAN does not exist", () => {
  const state = rootStateFactory({
    vlan: vlanStateFactory({ items: [], loading: false }),
  });
  const store = mockStore(state);
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <VLANLink id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(container).toBeEmptyDOMElement();
});

it("renders a link if VLANs have loaded and it exists", () => {
  const vlan = vlanFactory();
  const state = rootStateFactory({
    vlan: vlanStateFactory({ items: [vlan], loading: false }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <VLANLink id={vlan.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    urls.subnets.vlan.index({ id: vlan.id })
  );
});
