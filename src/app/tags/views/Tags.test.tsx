import type { Mock } from "vitest";

import { Label as TagsHeaderLabel } from "../components/TagsHeader/TagsHeader";

import { Label as TagDetailsLabel } from "./TagDetails/TagDetails";
import { Label as TagListLabel } from "./TagList/TagList";
import Tags from "./Tags";

import urls from "@/app/base/urls";
import { Label as NotFoundLabel } from "@/app/base/views/NotFound/NotFound";
import type { RootState } from "@/app/store/root/types";
import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

describe("Tags", () => {
  let scrollToSpy: Mock;
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      tag: tagStateFactory({
        loaded: true,
        items: [tagFactory({ id: 1 }), tagFactory()],
      }),
    });
    // Mock the scrollTo method as jsdom doesn't support this and will error.
    scrollToSpy = vi.fn();
    global.scrollTo = scrollToSpy;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  [
    {
      label: TagDetailsLabel.Title,
      path: urls.tags.tag.index({ id: 1 }),
    },
    {
      label: TagListLabel.Title,
      path: urls.tags.index,
      pattern: `${urls.tags.index}/*`,
    },
    {
      label: NotFoundLabel.Title,
      path: `${urls.tags.index}/not/a/path`,
      pattern: `${urls.tags.index}/*`,
    },
  ].forEach(({ label, path, pattern = `${urls.tags.tag.index(null)}/*` }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithBrowserRouter(<Tags />, {
        routePattern: pattern,
        state,
        route: path,
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it("shows buttons when not displaying forms", () => {
    renderWithBrowserRouter(<Tags />, {
      routePattern: `${urls.tags.tag.index(null)}/*`,
      state,
      route: urls.tags.tag.index({ id: 1 }),
    });

    expect(
      screen.getByRole("button", { name: TagsHeaderLabel.CreateButton })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: TagDetailsLabel.DeleteButton,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: TagDetailsLabel.EditButton })
    ).toBeInTheDocument();
  });
});
