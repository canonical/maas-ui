import type { Mock } from "vitest";

import TagsHeader from "./TagsHeader";

import { TagSidePanelViews } from "@/app/tags/constants";
import { rootState as rootStateFactory } from "@/testing/factories";
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

it("can call a function to display the add tag form", async () => {
  const setSidePanelContent = vi.fn();
  renderWithBrowserRouter(
    <TagsHeader setSidePanelContent={setSidePanelContent} />,
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
  renderWithBrowserRouter(<TagsHeader setSidePanelContent={vi.fn()} />, {
    route: "/tags",
    state: rootStateFactory(),
  });
  expect(
    screen.getByRole("heading", { level: 1, name: "Tags" })
  ).toBeInTheDocument();
  expect(screen.getByTestId("section-header-title").textContent).toBe("Tags");
});
