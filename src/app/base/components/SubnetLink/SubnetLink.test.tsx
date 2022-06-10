import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import SubnetLink from "./SubnetLink";

import subnetsURLs from "app/subnets/urls";
import {
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("handles when subnets are loading", () => {
  const state = rootStateFactory({
    subnet: subnetStateFactory({ items: [], loading: true }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <SubnetLink id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByLabelText("Loading subnets")).toBeInTheDocument();
});

it("handles when a subnet does not exist", () => {
  const state = rootStateFactory({
    subnet: subnetStateFactory({ items: [], loading: false }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <SubnetLink id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.queryByRole("link")).toBeNull();
  expect(screen.getByText("Unconfigured")).toBeInTheDocument();
});

it("renders a link if subnets have loaded and it exists", () => {
  const subnet = subnetFactory();
  const state = rootStateFactory({
    subnet: subnetStateFactory({ items: [subnet], loading: false }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <SubnetLink id={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    subnetsURLs.subnet.index({ id: subnet.id })
  );
});
