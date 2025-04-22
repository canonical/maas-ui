import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import VirshResources from "./VirshResources";

import * as factory from "@/testing/factories";

const mockStore = configureStore();

describe("VirshResources", () => {
  it("shows a spinner if pods have not loaded yet", () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [],
        loaded: false,
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <VirshResources id={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
