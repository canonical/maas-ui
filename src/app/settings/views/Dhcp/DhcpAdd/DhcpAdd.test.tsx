import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { DhcpAdd } from "./DhcpAdd";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("DhcpAdd", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory();
  });

  it("can render", () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/dhcp/add", key: "testKey" }]}
        >
          <CompatRouter>
            <DhcpAdd />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("form", { name: "Add DHCP snippet" })
    ).toBeInTheDocument();
  });
});
