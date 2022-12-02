import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ControllerListControls from "./ControllerListControls";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("ControllerListControls", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory();
  });

  it("changes the search text when the filters change", () => {
    const store = mockStore(initialState);
    const { rerender } = render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <ControllerListControls filter={""} setFilter={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("searchbox")).toHaveValue("");

    rerender(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <ControllerListControls filter={"free-text"} setFilter={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("searchbox")).toHaveValue("free-text");
  });
});
