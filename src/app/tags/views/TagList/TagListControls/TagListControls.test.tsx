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
import { render, screen, userEvent } from "testing/utils";

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

it("can update the filter", async () => {
  const setFilter = jest.fn();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagListControls
          currentPage={0}
          filter={TagSearchFilter.All}
          searchText={""}
          setCurrentPage={jest.fn()}
          setFilter={setFilter}
          setSearchText={jest.fn()}
          tagCount={0}
        />
      </MemoryRouter>
    </Provider>
  );
  await userEvent.click(screen.getByRole("tab", { name: Label.Manual }));
  expect(setFilter).toHaveBeenCalledWith(TagSearchFilter.Manual);
});
