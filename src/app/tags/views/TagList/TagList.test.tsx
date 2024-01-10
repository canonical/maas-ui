import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import TagList from "./TagList";

import type { RootState } from "app/store/root/types";
import { TagSearchFilter } from "app/store/tag/selectors";
import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

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

it("renders", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags" }]}>
        <CompatRouter>
          <TagList
            currentPage={1}
            filter={TagSearchFilter.All}
            onDelete={jest.fn()}
            searchText=""
            setCurrentPage={jest.fn()}
            tableId="test-table"
            tags={[]}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByLabelText("pagination")).toBeInTheDocument();
  expect(screen.getByRole("grid", { name: "tags" })).toBeInTheDocument();
});
