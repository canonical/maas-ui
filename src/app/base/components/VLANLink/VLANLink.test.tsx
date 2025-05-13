import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import VLANLink from "./VLANLink";

import urls from "@/app/base/urls";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

it("handles when VLANs are loading", () => {
  const state = factory.rootState({
    vlan: factory.vlanState({ items: [], loading: true }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <VLANLink id={1} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByLabelText("Loading VLANs")).toBeInTheDocument();
});

it("handles when a VLAN does not exist", () => {
  const state = factory.rootState({
    vlan: factory.vlanState({ items: [], loading: false }),
  });
  const store = mockStore(state);
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter>
        <VLANLink id={1} />
      </MemoryRouter>
    </Provider>
  );

  expect(container).toBeEmptyDOMElement();
});

it("renders a link if VLANs have loaded and it exists", () => {
  const vlan = factory.vlan();
  const state = factory.rootState({
    vlan: factory.vlanState({ items: [vlan], loading: false }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <VLANLink id={vlan.id} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    urls.subnets.vlan.index({ id: vlan.id })
  );
});
