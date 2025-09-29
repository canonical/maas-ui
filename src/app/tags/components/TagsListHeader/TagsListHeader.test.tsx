import type { Mock } from "vitest";

import TagsListHeader, { Label } from "./TagsListHeader";

import { TagSearchFilter } from "@/app/store/tag/selectors";
import { TagSidePanelViews } from "@/app/tags/constants";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen, userEvent } from "@/testing/utils";

let scrollToSpy: Mock;

beforeEach(() => {
  // Mock the scrollTo method as jsdom doesn't support this and will error.
  scrollToSpy = vi.fn();
  global.scrollTo = scrollToSpy;
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("displays the searchbox and group select", () => {
  renderWithProviders(
    <TagsListHeader
      filter={TagSearchFilter.All}
      searchText=""
      setFilter={vi.fn()}
      setSearchText={vi.fn()}
      setSidePanelContent={vi.fn()}
    />,
    {
      initialEntries: ["/tags"],
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

it("can call a function to display the add tag form", async () => {
  const setSidePanelContent = vi.fn();
  renderWithProviders(
    <TagsListHeader
      filter={TagSearchFilter.All}
      searchText=""
      setFilter={vi.fn()}
      setSearchText={vi.fn()}
      setSidePanelContent={setSidePanelContent}
    />,
    {
      initialEntries: ["/tags"],
      state: factory.rootState(),
    }
  );

  await userEvent.click(screen.getByRole("button", { name: "Create new tag" }));
  expect(setSidePanelContent).toHaveBeenCalledWith({
    view: TagSidePanelViews.AddTag,
  });
});

it("displays the default title", () => {
  renderWithProviders(
    <TagsListHeader
      filter={TagSearchFilter.All}
      searchText=""
      setFilter={vi.fn()}
      setSearchText={vi.fn()}
      setSidePanelContent={vi.fn()}
    />,
    {
      initialEntries: ["/tags"],
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
  renderWithProviders(
    <TagsListHeader
      filter={TagSearchFilter.All}
      searchText=""
      setFilter={setFilter}
      setSearchText={vi.fn()}
      setSidePanelContent={vi.fn()}
    />,
    {
      initialEntries: ["/tags"],
      state: factory.rootState(),
    }
  );

  await userEvent.click(screen.getByRole("tab", { name: Label.Manual }));
  expect(setFilter).toHaveBeenCalledWith(TagSearchFilter.Manual);
});
