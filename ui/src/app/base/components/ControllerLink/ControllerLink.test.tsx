import { generateLegacyURL } from "@maas-ui/maas-ui-shared";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ControllerLink from "./ControllerLink";

import controllersURLs from "app/controllers/urls";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  modelRef as modelRefFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("handles when controllers are loading", () => {
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [], loading: true }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ControllerLink systemId="abc123" />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByLabelText("Loading controllers")).toBeInTheDocument();
});

it("handles when a controller does not exist", () => {
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [], loading: false }),
  });
  const store = mockStore(state);
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter>
        <ControllerLink systemId="abc123" />
      </MemoryRouter>
    </Provider>
  );

  expect(container).toBeEmptyDOMElement();
});

it("renders a link if controllers have loaded and it exists", () => {
  const controller = controllerFactory({
    domain: modelRefFactory({ name: "maas" }),
    hostname: "bolla",
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [controller], loading: false }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ControllerLink systemId={controller.system_id} />
      </MemoryRouter>
    </Provider>
  );

  const link = screen.getByRole("link");
  expect(link).toHaveTextContent("bolla.maas");
  expect(link).toHaveAttribute(
    "href",
    generateLegacyURL(
      controllersURLs.controller.index({ id: controller.system_id })
    )
  );
});
