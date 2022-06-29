import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import SpaceLink from "./SpaceLink";

import urls from "app/base/urls";
import {
  rootState as rootStateFactory,
  space as spaceFactory,
  spaceState as spaceStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("handles when spaces are loading", () => {
  const state = rootStateFactory({
    space: spaceStateFactory({ items: [], loading: true }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <SpaceLink id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByLabelText("Loading spaces")).toBeInTheDocument();
});

it("handles when a space does not exist", () => {
  const state = rootStateFactory({
    space: spaceStateFactory({ items: [], loading: false }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <SpaceLink id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.queryByRole("link")).toBeNull();
  expect(screen.getByText("No space")).toBeInTheDocument();
});

it("renders a link if spaces have loaded and it exists", () => {
  const space = spaceFactory();
  const state = rootStateFactory({
    space: spaceStateFactory({ items: [space], loading: false }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <SpaceLink id={space.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    urls.subnets.space.index({ id: space.id })
  );
});
