import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ControllerStorage from "./ControllerStorage";

import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

it("displays a spinner if controller is loading", () => {
  const state = factory.rootState({
    controller: factory.controllerState({
      items: [],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ControllerStorage systemId="abc123" />
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByRole("alert", { name: "Loading controller" })
  ).toBeInTheDocument();
});
