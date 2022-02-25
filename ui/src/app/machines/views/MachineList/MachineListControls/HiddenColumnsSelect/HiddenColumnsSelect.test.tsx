import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import HiddenColumnsSelect from "./HiddenColumnsSelect";

import { rootState as rootStateFactory } from "testing/factories";

it("calls toggleHiddenColumn correctly on click of a checkbox", () => {
  const mockStore = configureStore();
  const hiddenColumns: Array<""> = [];
  const store = mockStore(rootStateFactory());

  const toggleHiddenColumn = jest.fn();
  render(
    <Provider store={store}>
      <HiddenColumnsSelect
        hiddenColumns={hiddenColumns}
        toggleHiddenColumn={toggleHiddenColumn}
      />
    </Provider>
  );
  userEvent.click(screen.getByRole("button", { name: "Hidden columns" }));
  userEvent.click(screen.getByRole("checkbox", { name: "RAM" }));
  expect(toggleHiddenColumn).toHaveBeenCalledWith("memory");
});
