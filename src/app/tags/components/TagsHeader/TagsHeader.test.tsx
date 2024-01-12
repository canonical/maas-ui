import { Route, Routes } from "react-router-dom-v5-compat";
import type { Mock } from "vitest";

import TagsHeader, { Label } from "./TagsHeader";

import urls from "@/app/base/urls";
import { TagSearchFilter } from "@/app/store/tag/selectors";
import { TagSidePanelViews } from "@/app/tags/constants";
import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

let scrollToSpy: Mock;

beforeEach(() => {
  // Mock the scrollTo method as jsdom doesn't support this and will error.
  scrollToSpy = vi.fn();
  global.scrollTo = scrollToSpy;
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("displays the searchbox and group select when isDetails is false", () => {
  renderWithBrowserRouter(
    <TagsHeader
      filter={TagSearchFilter.All}
      isDetails={false}
      onDelete={jest.fn()}
      searchText=""
      setFilter={jest.fn()}
      setSearchText={jest.fn()}
      setSidePanelContent={jest.fn()}
    />,
    {
      route: "/tags",
      state: rootStateFactory(),
    }
  );

  expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
  expect(screen.getByRole("tablist")).toBeInTheDocument();

  expect(
    screen.queryByRole("link", { name: /Back to all tags/i })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: Label.DeleteButton })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: Label.EditButton })
  ).not.toBeInTheDocument();
});

it("displays edit and delete buttons, and a return link when isDetails is true", () => {
  const tag = tagFactory({ id: 1 });
  const state = rootStateFactory({
    tag: tagStateFactory({
      loaded: true,
      loading: false,
      items: [tag],
    }),
  });
  renderWithBrowserRouter(
    <Routes>
      <Route
        element={
          <TagsHeader
            filter={TagSearchFilter.All}
            isDetails={true}
            onDelete={jest.fn()}
            searchText=""
            setFilter={jest.fn()}
            setSearchText={jest.fn()}
            setSidePanelContent={jest.fn()}
          />
        }
        path={urls.tags.tag.index(null)}
      />
    </Routes>,
    {
      route: urls.tags.tag.index({ id: 1 }),
      state,
    }
  );

  expect(
    screen.queryByRole("searchbox", { name: "Search" })
  ).not.toBeInTheDocument();
  expect(screen.queryByRole("tablist")).not.toBeInTheDocument();

  expect(
    screen.getByRole("link", { name: /Back to all tags/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: Label.DeleteButton })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: Label.EditButton })
  ).toBeInTheDocument();
});

it("can call a function to display the add tag form", async () => {
  const setSidePanelContent = vi.fn();
  renderWithBrowserRouter(
    <TagsHeader
      filter={TagSearchFilter.All}
      isDetails={false}
      onDelete={jest.fn()}
      searchText=""
      setFilter={jest.fn()}
      setSearchText={jest.fn()}
      setSidePanelContent={setSidePanelContent}
    />,
    {
      route: "/tags",
      state: rootStateFactory(),
    }
  );

  await userEvent.click(screen.getByRole("button", { name: "Create new tag" }));
  expect(setSidePanelContent).toHaveBeenCalledWith({
    view: TagSidePanelViews.AddTag,
  });
});

it("displays the default title", () => {
  renderWithBrowserRouter(
    <TagsHeader
      filter={TagSearchFilter.All}
      isDetails={false}
      onDelete={vi.fn()}
      searchText=""
      setFilter={vi.fn()}
      setSearchText={vi.fn()}
      setSidePanelContent={vi.fn()}
    />,
    {
      route: "/tags",
      state: rootStateFactory(),
    }
  );
  expect(
    screen.getByRole("heading", { level: 1, name: "Tags" })
  ).toBeInTheDocument();
  expect(screen.getByTestId("main-toolbar-heading").textContent).toBe("Tags");
});

it("can update the filter", async () => {
  const setFilter = vi.fn();
  renderWithBrowserRouter(
    <TagsHeader
      filter={TagSearchFilter.All}
      isDetails={false}
      onDelete={vi.fn()}
      searchText=""
      setFilter={setFilter}
      setSearchText={vi.fn()}
      setSidePanelContent={vi.fn()}
    />,
    {
      route: "/tags",
      state: rootStateFactory(),
    }
  );

  await userEvent.click(screen.getByRole("tab", { name: Label.Manual }));
  expect(setFilter).toHaveBeenCalledWith(TagSearchFilter.Manual);
});

it("can go to the tag edit page", async () => {
  const tag = tagFactory({ id: 1 });
  const state = rootStateFactory({
    tag: tagStateFactory({
      loaded: true,
      loading: false,
      items: [tag],
    }),
  });
  renderWithBrowserRouter(
    <Routes>
      <Route
        element={
          <TagsHeader
            filter={TagSearchFilter.All}
            isDetails={true}
            onDelete={vi.fn()}
            searchText=""
            setFilter={vi.fn()}
            setSearchText={vi.fn()}
            setSidePanelContent={vi.fn()}
          />
        }
        path={urls.tags.tag.index(null)}
      />
    </Routes>,
    { route: urls.tags.tag.index({ id: 1 }), state }
  );
  await userEvent.click(screen.getByRole("link", { name: "Edit" }));
  expect(window.location.pathname).toBe(urls.tags.tag.update({ id: 1 }));
});
