import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagList from "./TagList";

import type { RootState } from "@/app/store/root/types";
import { TagSearchFilter } from "@/app/store/tag/selectors";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  state = factory.rootState({
    tag: factory.tagState({
      items: [
        factory.tag({
          name: "rad",
        }),
        factory.tag({
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
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={vi.fn()}
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
