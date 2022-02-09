import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import EditBootArchitectures from "./EditBootArchitectures";

import {
  knownBootArchitecturesState as knownBootArchitecturesStateFactory,
  generalState as generalStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("shows a spinner while data is loading", () => {
  const state = rootStateFactory({
    general: generalStateFactory({
      knownBootArchitectures: knownBootArchitecturesStateFactory({
        loading: true,
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <EditBootArchitectures id={1} setActiveForm={jest.fn()} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("loading-data")).toBeInTheDocument();
});
