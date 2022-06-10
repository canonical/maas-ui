import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ActionBar from "./ActionBar";

import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("ActionBar", () => {
  it("displays provided actions", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <ActionBar
          actions={<span data-testid="actions">Actions</span>}
          currentPage={1}
          itemCount={10}
          onSearchChange={jest.fn()}
          searchFilter=""
          setCurrentPage={jest.fn()}
        />
      </Provider>
    );
    expect(screen.getByTestId("actions")).toBeInTheDocument();
  });
});
