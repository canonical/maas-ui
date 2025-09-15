import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import FabricControllers from "./FabricControllers";

import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

it("displays a spinner when loading controllers", () => {
  const controller = factory.controller({
    hostname: "controller-1",
  });
  const state = factory.rootState({
    controller: factory.controllerState({
      loaded: true,
      items: [controller],
    }),
  });
  const store = mockStore(state);
  const fabric = factory.fabric({ id: 1 });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <FabricControllers id={fabric.id} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("Spinner")).toBeInTheDocument();
});
