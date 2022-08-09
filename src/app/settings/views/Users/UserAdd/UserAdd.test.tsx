import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { UserAdd } from "./UserAdd";

import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  statusState as statusStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("UserAdd", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      status: statusStateFactory({
        externalAuthURL: null,
      }),
    });
  });

  it("can render", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users/add", key: "testKey" }]}
        >
          <CompatRouter>
            <UserAdd />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("heading", { name: "Add user" })
    ).toBeInTheDocument();
  });
});
