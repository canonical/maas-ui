import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagTable, { Label, TestId } from "./TagTable";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { TagSearchFilter } from "@/app/store/tag/selectors";
import type { Tag } from "@/app/store/tag/types";
import * as factory from "@/testing/factories";
import { userEvent, render, screen, within } from "@/testing/utils";

vi.mock("../constants", () => ({
  __esModule: true,
  // Mock the number of items per page to allow testing pagination.
  TAGS_PER_PAGE: 2,
}));

const mockStore = configureStore();
let state: RootState;
let tags: Tag[];

beforeEach(() => {
  tags = [
    factory.tag({
      id: 1,
      name: "rad",
    }),
    factory.tag({
      id: 2,
      name: "cool",
    }),
  ];
  state = factory.rootState({
    tag: factory.tagState({
      items: tags,
    }),
  });
});

afterEach(() => {
  // vi.resetModules();
  // getTagsPerPage.mockReset()
});

it("displays tags", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.All}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={vi.fn()}
            tags={tags}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const names = screen.queryAllByRole("gridcell", {
    name: Label.Name,
  });
  expect(names).toHaveLength(2);
  expect(names.find((td) => td.textContent === "rad")).toBeInTheDocument();
  expect(names.find((td) => td.textContent === "cool")).toBeInTheDocument();
});

it("displays the tags in order", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.All}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={vi.fn()}
            tags={tags}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const names = screen.queryAllByRole("gridcell", {
    name: Label.Name,
  });
  expect(names[0].textContent).toBe("cool");
  expect(names[1].textContent).toBe("rad");
});

it("can change the sort order", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.All}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={vi.fn()}
            tags={tags}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  let names = screen.queryAllByRole("gridcell", {
    name: Label.Name,
  });
  expect(names[0].textContent).toBe("cool");
  expect(names[1].textContent).toBe("rad");
  await userEvent.click(
    screen.getByRole("button", { name: `${Label.Name} (descending)` })
  );
  names = screen.queryAllByRole("gridcell", {
    name: Label.Name,
  });
  expect(names[0].textContent).toBe("rad");
  expect(names[1].textContent).toBe("cool");
});

it("displays the tags for the current page", () => {
  tags = [
    factory.tag({
      name: "rad",
    }),
    factory.tag({
      name: "cool",
    }),
    factory.tag({
      name: "hip",
    }),
    factory.tag({
      name: "totes",
    }),
  ];

  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={2}
            filter={TagSearchFilter.All}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={vi.fn()}
            tags={tags}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const names = screen.queryAllByRole("gridcell", {
    name: Label.Name,
  });
  expect(names).toHaveLength(2);
  expect(names.find((td) => td.textContent === "rad")).toBeInTheDocument();
  expect(names.find((td) => td.textContent === "totes")).toBeInTheDocument();
});

it("shows an icon for automatic tags", () => {
  tags = [factory.tag({ definition: "automatic" })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.All}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={vi.fn()}
            tags={tags}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const auto = screen.getByRole("gridcell", {
    name: Label.Auto,
  });
  // eslint-disable-next-line testing-library/no-node-access
  expect(auto.querySelector(".p-icon--success-grey")).toBeInTheDocument();
});

it("does not show an icon for manual tags", () => {
  tags = [factory.tag({ definition: undefined })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.All}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={vi.fn()}
            tags={tags}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const auto = screen.getByRole("gridcell", {
    name: Label.Auto,
  });
  // eslint-disable-next-line testing-library/no-node-access
  expect(auto.querySelector(".p-icon--success-grey")).not.toBeInTheDocument();
});

it("shows an icon for kernel options", () => {
  tags = [factory.tag({ kernel_opts: "i'm a kernel option" })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.All}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={vi.fn()}
            tags={tags}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const auto = screen.getByRole("gridcell", {
    name: Label.Options,
  });
  // eslint-disable-next-line testing-library/no-node-access
  expect(auto.querySelector(".p-icon--success-grey")).toBeInTheDocument();
});

it("does not show an icon for tags without kernel options", () => {
  tags = [factory.tag({ kernel_opts: undefined })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.All}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={vi.fn()}
            tags={tags}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const auto = screen.getByRole("gridcell", {
    name: Label.Options,
  });
  // eslint-disable-next-line testing-library/no-node-access
  expect(auto.querySelector(".p-icon--success-grey")).not.toBeInTheDocument();
});

it("can link to nodes", () => {
  tags = [
    factory.tag({
      machine_count: 1,
      device_count: 2,
      controller_count: 3,
      name: "a-tag",
    }),
  ];
  state.tag.items = tags;
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.All}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={vi.fn()}
            tags={tags}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const cells = screen.queryAllByRole("gridcell", {
    name: Label.AppliedTo,
  });
  const appliedTo = cells[cells.length - 1];
  const machineLink = within(appliedTo).getByRole("link", {
    name: "1 machine",
  });
  const deviceLink = within(appliedTo).getByRole("link", {
    name: "2 devices",
  });
  const controllerLink = within(appliedTo).getByRole("link", {
    name: "3 controllers",
  });
  expect(machineLink).toBeInTheDocument();
  expect(controllerLink).toBeInTheDocument();
  expect(deviceLink).toBeInTheDocument();
  expect(machineLink).toHaveAttribute(
    "href",
    `${urls.machines.index}?tags=%3Da-tag`
  );
  expect(controllerLink).toHaveAttribute(
    "href",
    `${urls.controllers.index}?tags=%3Da-tag`
  );
  expect(deviceLink).toHaveAttribute(
    "href",
    `${urls.devices.index}?tags=%3Da-tag`
  );
});

it("does not display a message if there are tags", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.All}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={vi.fn()}
            tags={[]}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.queryByTestId(TestId.NoTags)).not.toBeInTheDocument();
});

it("displays a message if there are no automatic tags", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.Auto}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={vi.fn()}
            tags={[]}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByTestId(TestId.NoTags).textContent).toBe(
    "There are no automatic tags."
  );
});

it("displays a message if there are no manual tags", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.Manual}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={vi.fn()}
            tags={[]}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByTestId(TestId.NoTags).textContent).toBe(
    "There are no manual tags."
  );
});

it("displays a message if none match the search terms", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.All}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText="nothing"
            setCurrentPage={vi.fn()}
            tags={[]}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByTestId(TestId.NoTags).textContent).toBe(
    "No tags match the search criteria."
  );
});

it("displays a message if none match the filter and search terms", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.Auto}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText="nothing"
            setCurrentPage={vi.fn()}
            tags={[]}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByTestId(TestId.NoTags).textContent).toBe(
    "No automatic tags match the search criteria."
  );
});

it("returns to the first page if the search changes", () => {
  const setCurrentPage = vi.fn();
  const store = mockStore(state);
  const { rerender } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.Auto}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={setCurrentPage}
            tags={[]}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  rerender(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.Auto}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText="new"
            setCurrentPage={setCurrentPage}
            tags={[]}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(setCurrentPage).toHaveBeenCalledWith(1);
});

it("returns to the first page if the filter changes", () => {
  const setCurrentPage = vi.fn();
  const store = mockStore(state);
  const { rerender } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.All}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={setCurrentPage}
            tags={[]}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  rerender(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <TagTable
            currentPage={1}
            filter={TagSearchFilter.Manual}
            onDelete={vi.fn()}
            onUpdate={vi.fn()}
            searchText=""
            setCurrentPage={setCurrentPage}
            tags={[]}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(setCurrentPage).toHaveBeenCalledWith(1);
});

it("can trigger the tag edit sidepanel", async () => {
  const path = urls.tags.tag.machines({ id: 1 });
  const history = createMemoryHistory({
    initialEntries: [{ pathname: path }],
  });
  const store = mockStore(state);
  const onUpdate = vi.fn();
  render(
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <Route
            component={() => (
              <TagTable
                currentPage={1}
                filter={TagSearchFilter.All}
                onDelete={vi.fn()}
                onUpdate={onUpdate}
                searchText=""
                setCurrentPage={vi.fn()}
                tags={tags}
              />
            )}
            exact
            path={path}
          />
        </CompatRouter>
      </Router>
    </Provider>
  );
  await userEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);
  expect(onUpdate).toHaveBeenCalled();
});
