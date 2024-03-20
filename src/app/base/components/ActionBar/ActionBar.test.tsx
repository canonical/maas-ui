import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ActionBar from "./ActionBar";

import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

describe("ActionBar", () => {
  it("displays provided actions", () => {
    const state = factory.rootState();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <ActionBar
          actions={<span data-testid="actions">Actions</span>}
          currentPage={1}
          itemCount={10}
          onSearchChange={vi.fn()}
          searchFilter=""
          setCurrentPage={vi.fn()}
        />
      </Provider>
    );
    expect(screen.getByTestId("actions")).toBeInTheDocument();
  });
});
