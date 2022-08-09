import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { DhcpEdit } from "./DhcpEdit";

import type { RootState } from "app/store/root/types";
import {
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DhcpEdit", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        items: [
          dhcpSnippetFactory({
            id: 1,
          }),
          dhcpSnippetFactory({
            id: 2,
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("displays a loading component if loading", () => {
    state.dhcpsnippet.loading = true;
    state.dhcpsnippet.loaded = false;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/dhcp/1/edit", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <DhcpEdit />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles dhcp snippet not found", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/dhcp/99999/edit", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <DhcpEdit />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("DHCP snippet not found")).toBeInTheDocument();
  });

  it("can display a dhcp snippet edit form", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/dhcp/1/edit", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <Routes>
              <Route element={<DhcpEdit />} path="/settings/dhcp/:id/edit" />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("form", { name: "Editing `test snippet`" })
    ).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: "Snippet name" })).toHaveValue(
      "test snippet"
    );

    expect(screen.getByRole("textbox", { name: "Description" })).toHaveValue(
      "test description"
    );

    expect(screen.getByRole("checkbox", { name: "Enabled" })).not.toBeChecked();

    expect(screen.getByRole("textbox", { name: "DHCP snippet" })).toHaveValue(
      "test value"
    );
  });
});
