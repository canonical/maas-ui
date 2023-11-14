import type { Mock } from "vitest";

import TagForms from "./TagForms";

import { TagSidePanelViews } from "@/app/tags/constants";
import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

let scrollToSpy: Mock;

beforeEach(() => {
  // Mock the scrollTo method as jsdom doesn't support this and will error.
  scrollToSpy = vi.fn();
  global.scrollTo = scrollToSpy;
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("can display the add tag form", () => {
  renderWithBrowserRouter(
    <TagForms
      setSidePanelContent={vi.fn()}
      sidePanelContent={{ view: TagSidePanelViews.AddTag }}
    />,
    { route: "/tags", state: rootStateFactory() }
  );
  expect(screen.getByRole("form", { name: "Create tag" })).toBeInTheDocument();
});

it("can display the delete tag form", () => {
  const state = rootStateFactory({
    tag: tagStateFactory({
      items: [
        tagFactory({
          id: 1,
        }),
      ],
    }),
  });
  renderWithBrowserRouter(
    <TagForms
      setSidePanelContent={vi.fn()}
      sidePanelContent={{
        view: TagSidePanelViews.DeleteTag,
        extras: { id: 1 },
      }}
    />,
    { route: "/tags", state }
  );
  expect(screen.getByRole("form", { name: "Delete tag" })).toBeInTheDocument();
});
