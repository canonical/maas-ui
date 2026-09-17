import type { Mock } from "vitest";

import AddTagForm from "../AddTagForm";

import TagsListHeader, { Label } from "./TagsListHeader";

import { TagSearchFilter } from "@/app/store/tag/selectors";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

let scrollToSpy: Mock;
const { mockOpen } = await mockSidePanel();

beforeEach(() => {
  // Mock the scrollTo method as jsdom doesn't support this and will error.
  scrollToSpy = vi.fn();
  global.scrollTo = scrollToSpy;
});

afterEach(() => {
  vi.clearAllMocks();
});

it("displays the searchbox and group select", () => {
  renderWithProviders(
    <TagsListHeader
      filter={TagSearchFilter.All}
      searchText=""
      setFilter={vi.fn()}
      setSearchText={vi.fn()}
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
  renderWithProviders(
    <TagsListHeader
      filter={TagSearchFilter.All}
      searchText=""
      setFilter={vi.fn()}
      setSearchText={vi.fn()}
    />,
    {
      initialEntries: ["/tags"],
      state: factory.rootState(),
    }
  );

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: Label.CreateButton })
    ).not.toBeAriaDisabled();
  });

  await userEvent.click(
    screen.getByRole("button", { name: Label.CreateButton })
  );

  expect(mockOpen).toHaveBeenCalledWith({
    component: AddTagForm,
    title: "Create new tag",
  });
});

it("enables the create button when the user has edit entitlements", async () => {
  renderWithProviders(
    <TagsListHeader
      filter={TagSearchFilter.All}
      searchText=""
      setFilter={vi.fn()}
      setSearchText={vi.fn()}
    />,
    {
      initialEntries: ["/tags"],
      state: factory.rootState(),
    }
  );

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: Label.CreateButton })
    ).not.toBeAriaDisabled();
  });
});

it("disables the create button when the user lacks edit entitlements", async () => {
  mockServer.use(authResolvers.getMeEntitlements.handler([]));
  renderWithProviders(
    <TagsListHeader
      filter={TagSearchFilter.All}
      searchText=""
      setFilter={vi.fn()}
      setSearchText={vi.fn()}
    />,
    {
      initialEntries: ["/tags"],
      state: factory.rootState(),
    }
  );

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: Label.CreateButton })
    ).toBeAriaDisabled();
  });

  await userEvent.click(
    screen.getByRole("button", { name: Label.CreateButton })
  );

  expect(mockOpen).not.toHaveBeenCalled();
});

it("displays the default title", () => {
  renderWithProviders(
    <TagsListHeader
      filter={TagSearchFilter.All}
      searchText=""
      setFilter={vi.fn()}
      setSearchText={vi.fn()}
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
    />,
    {
      initialEntries: ["/tags"],
      state: factory.rootState(),
    }
  );

  await userEvent.click(screen.getByRole("tab", { name: Label.Manual }));
  expect(setFilter).toHaveBeenCalledWith(TagSearchFilter.Manual);
});
