import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ControllerLink, { Labels } from "./ControllerLink";

import urls from "@/app/base/urls";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

it("handles when controllers are loading", () => {
  const state = factory.rootState({
    controller: factory.controllerState({ items: [], loading: true }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ControllerLink systemId="abc123" />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByLabelText(Labels.LoadingControllers)).toBeInTheDocument();
});

it("handles when a controller does not exist", () => {
  const state = factory.rootState({
    controller: factory.controllerState({ items: [], loading: false }),
  });
  const store = mockStore(state);
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ControllerLink systemId="abc123" />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(container).toBeEmptyDOMElement();
});

it("renders a link if controllers have loaded and it exists", () => {
  const controller = factory.controller({
    domain: factory.modelRef({ name: "maas" }),
    hostname: "bolla",
  });
  const state = factory.rootState({
    controller: factory.controllerState({
      items: [controller],
      loading: false,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ControllerLink systemId={controller.system_id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  const link = screen.getByRole("link");
  expect(link).toHaveTextContent("bolla.maas");
  expect(link).toHaveAttribute(
    "href",
    urls.controllers.controller.index({ id: controller.system_id })
  );
});
