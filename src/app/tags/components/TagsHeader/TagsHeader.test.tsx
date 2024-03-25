import { Route, Routes } from "react-router-dom";
import type { Mock } from "vitest";

import TagsHeader, { Label } from "./TagsHeader";

import urls from "@/app/base/urls";
import { TagSearchFilter } from "@/app/store/tag/selectors";
import { TagSidePanelViews } from "@/app/tags/constants";
import * as factory from "@/testing/factories";
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
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setFilter={vi.fn()}
      setSearchText={vi.fn()}
      setSidePanelContent={vi.fn()}
    />,
    {
      route: "/tags",
      state: factory.rootState(),
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
  const tag = factory.tag({ id: 1 });
  const state = factory.rootState({
    tag: factory.tagState({
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
            onUpdate={vi.fn()}
            searchText=""
            setFilter={vi.fn()}
            setSearchText={vi.fn()}
            setSidePanelContent={vi.fn()}
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
    screen.getByRole("button", { name: Label.EditButton })
  ).toBeInTheDocument();
});

it("can call a function to display the add tag form", async () => {
  const setSidePanelContent = vi.fn();
  renderWithBrowserRouter(
    <TagsHeader
      filter={TagSearchFilter.All}
      isDetails={false}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setFilter={vi.fn()}
      setSearchText={vi.fn()}
      setSidePanelContent={setSidePanelContent}
    />,
    {
      route: "/tags",
      state: factory.rootState(),
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
      onUpdate={vi.fn()}
      searchText=""
      setFilter={vi.fn()}
      setSearchText={vi.fn()}
      setSidePanelContent={vi.fn()}
    />,
    {
      route: "/tags",
      state: factory.rootState(),
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
      onUpdate={vi.fn()}
      searchText=""
      setFilter={setFilter}
      setSearchText={vi.fn()}
      setSidePanelContent={vi.fn()}
    />,
    {
      route: "/tags",
      state: factory.rootState(),
    }
  );

  await userEvent.click(screen.getByRole("tab", { name: Label.Manual }));
  expect(setFilter).toHaveBeenCalledWith(TagSearchFilter.Manual);
});

it("triggers onUpdate with the correct tag ID", async () => {
  const onUpdate = vi.fn();
  const tag = factory.tag({ id: 1 });
  const state = factory.rootState({
    tag: factory.tagState({
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
            onUpdate={onUpdate}
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
  await userEvent.click(screen.getByRole("button", { name: "Edit" }));
  expect(onUpdate).toBeCalledWith(1);
});
