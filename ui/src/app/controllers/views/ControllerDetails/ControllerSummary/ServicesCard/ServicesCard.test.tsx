import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ServicesCard from "./ServicesCard";

import { actions as serviceActions } from "app/store/service";
import {
  controllerDetails as controllerDetailsFactory,
  controllerState as controllerStateFactory,
  rootState as rootStateFactory,
  serviceState as serviceStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("fetches services on load", () => {
  const controller = controllerDetailsFactory();
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
  });
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <ServicesCard controller={controller} />
    </Provider>
  );

  const expectedAction = serviceActions.fetch();
  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
});

it("shows a spinner if services are loading", () => {
  const controller = controllerDetailsFactory();
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
    service: serviceStateFactory({
      loading: true,
    }),
  });
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <ServicesCard controller={controller} />
    </Provider>
  );

  expect(
    screen.getByRole("alert", { name: "Loading services" })
  ).toBeInTheDocument();
});
