import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagListControls, { Label } from "./TagListControls";

import type { RootState } from "app/store/root/types";
import { TagSearchFilter } from "app/store/tag/selectors";
import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    tag: tagStateFactory({
      items: [
        tagFactory({
          name: "rad",
        }),
        tagFactory({
          name: "cool",
        }),
      ],
    }),
  });
});

it("can update the filter", () => {
  const setFilter = jest.fn();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagListControls
          filter={TagSearchFilter.All}
          setFilter={setFilter}
          searchText={""}
          setSearchText={jest.fn()}
          currentPage={0}
          setCurrentPage={jest.fn()}
          tagCount={0}
        />
      </MemoryRouter>
    </Provider>
  );
  screen.getByRole("tab", { name: Label.Manual }).click();
  expect(setFilter).toHaveBeenCalledWith(TagSearchFilter.Manual);
});
