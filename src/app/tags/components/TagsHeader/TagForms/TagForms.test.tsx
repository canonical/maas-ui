import TagForms from "./TagForms";

import { TagSidePanelViews } from "@/app/tags/constants";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";
import type { Mock } from "vitest";

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
    { route: "/tags", state: factory.rootState() }
  );
  expect(screen.getByRole("form", { name: "Create tag" })).toBeInTheDocument();
});

it("can display the delete tag form", () => {
  const state = factory.rootState({
    tag: factory.tagState({
      items: [
        factory.tag({
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

it("can display the update tag form", () => {
  const state = factory.rootState({
    tag: factory.tagState({
      items: [
        factory.tag({
          id: 1,
        }),
      ],
    }),
  });
  renderWithBrowserRouter(
    <TagForms
      setSidePanelContent={vi.fn()}
      sidePanelContent={{
        view: TagSidePanelViews.UpdateTag,
        extras: { id: 1 },
      }}
    />,
    { route: "/tags", state }
  );
  expect(screen.getByRole("form", { name: "Update tag" })).toBeInTheDocument();
});
