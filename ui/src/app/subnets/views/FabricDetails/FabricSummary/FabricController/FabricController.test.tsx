import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import FabricControllers from "./FabricControllers";

import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  rootState as rootStateFactory,
  fabric as fabricFactory,
} from "testing/factories";

const mockStore = configureStore();

it("displays a spinner when loading controllers", () => {
  const controller = controllerFactory({
    hostname: "controller-1",
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      loaded: true,
      items: [controller],
    }),
  });
  const store = mockStore(state);
  const fabric = fabricFactory({ id: 1 });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <FabricControllers id={fabric.id} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("Spinner")).toBeInTheDocument();
});
