import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import SpaceLink from "./SpaceLink";

import urls from "@/app/base/urls";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

it("handles when spaces are loading", () => {
  const state = factory.rootState({
    space: factory.spaceState({ items: [], loading: true }),
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
  const state = factory.rootState({
    space: factory.spaceState({ items: [], loading: false }),
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
  const space = factory.space();
  const state = factory.rootState({
    space: factory.spaceState({ items: [space], loading: false }),
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
