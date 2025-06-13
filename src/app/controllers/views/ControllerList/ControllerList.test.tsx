import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import ControllerList from "./ControllerList";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  waitFor,
  renderWithProviders,
} from "@/testing/utils";

const mockStore = configureStore();

describe("ControllerList", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState();
  });

  it("sets the search text from the URL on load", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/controllers",
              search: "?q=test+search",
              key: "testKey",
            },
          ]}
        >
          <ControllerList />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("searchbox")).toHaveValue("test search");
  });

  it("changes the URL when the search text changes", async () => {
    const store = mockStore(state);
    const { router } = renderWithProviders(<ControllerList />, {
      store,
      initialEntries: ["/machines?q=test+search"],
    });

    await userEvent.clear(screen.getByRole("searchbox"));

    await userEvent.type(screen.getByRole("searchbox"), "hostname:foo");

    await waitFor(() => {
      expect(router.state.location.search).toBe("?hostname=foo");
    });
  });
});
