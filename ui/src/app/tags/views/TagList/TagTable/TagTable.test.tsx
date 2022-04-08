import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Router } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagTable, { Label, TestId } from "./TagTable";

import controllerURLs from "app/controllers/urls";
import deviceURLs from "app/devices/urls";
import machineURLs from "app/machines/urls";
import type { RootState } from "app/store/root/types";
import { TagSearchFilter } from "app/store/tag/selectors";
import type { Tag } from "app/store/tag/types";
import tagsURLs from "app/tags/urls";
import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

jest.mock("../constants", () => ({
  __esModule: true,
  // Mock the number of items per page to allow testing pagination.
  TAGS_PER_PAGE: 2,
}));

const mockStore = configureStore();
let state: RootState;
let tags: Tag[];

beforeEach(() => {
  tags = [
    tagFactory({
      id: 1,
      name: "rad",
    }),
    tagFactory({
      id: 2,
      name: "cool",
    }),
  ];
  state = rootStateFactory({
    tag: tagStateFactory({
      items: tags,
    }),
  });
});

afterEach(() => {
  // jest.resetModules();
  // getTagsPerPage.mockReset()
});

it("displays tags", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.All}
          onDelete={jest.fn()}
          searchText=""
          setCurrentPage={jest.fn()}
          tags={tags}
        />
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
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.All}
          onDelete={jest.fn()}
          searchText=""
          setCurrentPage={jest.fn()}
          tags={tags}
        />
      </MemoryRouter>
    </Provider>
  );
  const names = screen.queryAllByRole("gridcell", {
    name: Label.Name,
  });
  expect(names[0].textContent).toBe("cool");
  expect(names[1].textContent).toBe("rad");
});

it("can change the sort order", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.All}
          onDelete={jest.fn()}
          searchText=""
          setCurrentPage={jest.fn()}
          tags={tags}
        />
      </MemoryRouter>
    </Provider>
  );
  let names = screen.queryAllByRole("gridcell", {
    name: Label.Name,
  });
  expect(names[0].textContent).toBe("cool");
  expect(names[1].textContent).toBe("rad");
  screen.getByRole("button", { name: Label.Name }).click();
  names = screen.queryAllByRole("gridcell", {
    name: Label.Name,
  });
  expect(names[0].textContent).toBe("rad");
  expect(names[1].textContent).toBe("cool");
});

it("displays the tags for the current page", () => {
  tags = [
    tagFactory({
      name: "rad",
    }),
    tagFactory({
      name: "cool",
    }),
    tagFactory({
      name: "hip",
    }),
    tagFactory({
      name: "totes",
    }),
  ];

  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagTable
          currentPage={2}
          filter={TagSearchFilter.All}
          onDelete={jest.fn()}
          searchText=""
          setCurrentPage={jest.fn()}
          tags={tags}
        />
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
  tags = [tagFactory({ definition: "automatic" })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.All}
          onDelete={jest.fn()}
          searchText=""
          setCurrentPage={jest.fn()}
          tags={tags}
        />
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
  tags = [tagFactory({ definition: undefined })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.All}
          onDelete={jest.fn()}
          searchText=""
          setCurrentPage={jest.fn()}
          tags={tags}
        />
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
  tags = [tagFactory({ kernel_opts: "i'm a kernel option" })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.All}
          onDelete={jest.fn()}
          searchText=""
          setCurrentPage={jest.fn()}
          tags={tags}
        />
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
  tags = [tagFactory({ kernel_opts: undefined })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.All}
          onDelete={jest.fn()}
          searchText=""
          setCurrentPage={jest.fn()}
          tags={tags}
        />
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
    tagFactory({
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
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.All}
          onDelete={jest.fn()}
          searchText=""
          setCurrentPage={jest.fn()}
          tags={tags}
        />
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
    `${machineURLs.machines.index}?tags=%3Da-tag`
  );
  expect(controllerLink).toHaveAttribute(
    "href",
    `${controllerURLs.controllers.index}?tags=%3Da-tag`
  );
  expect(deviceLink).toHaveAttribute(
    "href",
    `${deviceURLs.devices.index}?tags=%3Da-tag`
  );
});

it("does not display a message if there are tags", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.All}
          onDelete={jest.fn()}
          searchText=""
          setCurrentPage={jest.fn()}
          tags={[]}
        />
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
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.Auto}
          onDelete={jest.fn()}
          searchText=""
          setCurrentPage={jest.fn()}
          tags={[]}
        />
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
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.Manual}
          onDelete={jest.fn()}
          searchText=""
          setCurrentPage={jest.fn()}
          tags={[]}
        />
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
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.All}
          onDelete={jest.fn()}
          searchText="nothing"
          setCurrentPage={jest.fn()}
          tags={[]}
        />
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
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.Auto}
          onDelete={jest.fn()}
          searchText="nothing"
          setCurrentPage={jest.fn()}
          tags={[]}
        />
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByTestId(TestId.NoTags).textContent).toBe(
    "No automatic tags match the search criteria."
  );
});

it("returns to the first page if the search changes", () => {
  const setCurrentPage = jest.fn();
  const store = mockStore(state);
  const { rerender } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.Auto}
          onDelete={jest.fn()}
          searchText=""
          setCurrentPage={setCurrentPage}
          tags={[]}
        />
      </MemoryRouter>
    </Provider>
  );
  rerender(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.Auto}
          onDelete={jest.fn()}
          searchText="new"
          setCurrentPage={setCurrentPage}
          tags={[]}
        />
      </MemoryRouter>
    </Provider>
  );
  expect(setCurrentPage).toHaveBeenCalledWith(1);
});

it("returns to the first page if the filter changes", () => {
  const setCurrentPage = jest.fn();
  const store = mockStore(state);
  const { rerender } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.All}
          onDelete={jest.fn()}
          searchText=""
          setCurrentPage={setCurrentPage}
          tags={[]}
        />
      </MemoryRouter>
    </Provider>
  );
  rerender(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagTable
          currentPage={1}
          filter={TagSearchFilter.Manual}
          onDelete={jest.fn()}
          searchText=""
          setCurrentPage={setCurrentPage}
          tags={[]}
        />
      </MemoryRouter>
    </Provider>
  );
  expect(setCurrentPage).toHaveBeenCalledWith(1);
});

it("can go to the tag edit page", () => {
  const path = tagsURLs.tag.machines({ id: 1 });
  const history = createMemoryHistory({
    initialEntries: [{ pathname: path }],
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <Route
          exact
          path={path}
          component={() => (
            <TagTable
              currentPage={1}
              filter={TagSearchFilter.All}
              onDelete={jest.fn()}
              searchText=""
              setCurrentPage={jest.fn()}
              tags={tags}
            />
          )}
        />
      </Router>
    </Provider>
  );
  userEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);
  expect(history.location.pathname).toBe(tagsURLs.tag.update({ id: 2 }));
  expect(history.location.state).toStrictEqual({ canGoBack: true });
});
