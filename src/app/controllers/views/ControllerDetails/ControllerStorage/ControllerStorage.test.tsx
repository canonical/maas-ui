import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ControllerStorage from "./ControllerStorage";

import {
  controllerState as controllerStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();

it("displays a spinner if controller is loading", () => {
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ControllerStorage systemId="abc123" />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByRole("alert", { name: "Loading controller" })
  ).toBeInTheDocument();
});
