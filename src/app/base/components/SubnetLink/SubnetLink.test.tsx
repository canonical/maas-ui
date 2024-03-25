import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import SubnetLink from "./SubnetLink";

import urls from "@/app/base/urls";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

it("handles when subnets are loading", () => {
  const state = factory.rootState({
    subnet: factory.subnetState({ items: [], loading: true }),
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
  const state = factory.rootState({
    subnet: factory.subnetState({ items: [], loading: false }),
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
  const subnet = factory.subnet();
  const state = factory.rootState({
    subnet: factory.subnetState({ items: [subnet], loading: false }),
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
    urls.subnets.subnet.index({ id: subnet.id })
  );
});
