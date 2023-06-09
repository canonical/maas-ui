import TagForms from "./TagForms";

import { TageSidePanelViews } from "app/tags/constants";
import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

let scrollToSpy: jest.Mock;

beforeEach(() => {
  // Mock the scrollTo method as jsdom doesn't support this and will error.
  scrollToSpy = jest.fn();
  global.scrollTo = scrollToSpy;
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("can display the add tag form", () => {
  renderWithBrowserRouter(
    <TagForms
      setSidePanelContent={jest.fn()}
      sidePanelContent={{ view: TageSidePanelViews.AddTag }}
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
      setSidePanelContent={jest.fn()}
      sidePanelContent={{
        view: TageSidePanelViews.DeleteTag,
        extras: { id: 1 },
      }}
    />,
    { route: "/tags", state }
  );
  expect(screen.getByRole("form", { name: "Delete tag" })).toBeInTheDocument();
});
