import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Label as TagsHeaderLabel } from "../components/TagsHeader/TagsHeader";

import { Label as TagDetailsLabel } from "./TagDetails/TagDetails";
import { Label as TagListLabel } from "./TagList/TagList";
import { Label as TagUpdateLabel } from "./TagUpdate/TagUpdate";
import Tags from "./Tags";

import { Label as NotFoundLabel } from "app/base/views/NotFound/NotFound";
import type { RootState } from "app/store/root/types";
import tagURLs from "app/tags/urls";
import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("Tags", () => {
  let scrollToSpy: jest.Mock;
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      tag: tagStateFactory({
        loaded: true,
        items: [tagFactory({ id: 1 }), tagFactory()],
      }),
    });
    // Mock the scrollTo method as jsdom doesn't support this and will error.
    scrollToSpy = jest.fn();
    global.scrollTo = scrollToSpy;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  [
    {
      label: TagDetailsLabel.Title,
      path: tagURLs.tag.index({ id: 1 }),
    },
    {
      label: TagUpdateLabel.Form,
      path: tagURLs.tag.update({ id: 1 }),
    },
    {
      label: TagListLabel.Title,
      path: tagURLs.tags.index,
    },
    {
      label: NotFoundLabel.Title,
      path: "/not/a/path",
    },
  ].forEach(({ label, path }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithBrowserRouter(<Tags />, {
        wrapperProps: { state },
        route: path,
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it("shows buttons when not displaying forms", () => {
    renderWithBrowserRouter(<Tags />, {
      wrapperProps: { state },
      route: tagURLs.tag.index({ id: 1 }),
    });
    const header = screen.getByLabelText(TagsHeaderLabel.Header);
    const details = screen.getByLabelText(TagDetailsLabel.Title);
    expect(
      within(header).getByRole("button", { name: TagsHeaderLabel.CreateButton })
    ).toBeInTheDocument();
    expect(
      within(details).getByRole("button", {
        name: TagDetailsLabel.DeleteButton,
      })
    ).toBeInTheDocument();
    expect(
      within(details).getByRole("link", { name: TagDetailsLabel.EditButton })
    ).toBeInTheDocument();
  });

  it("hides buttons when deleting tags", async () => {
    renderWithBrowserRouter(<Tags />, {
      wrapperProps: { state },
      route: tagURLs.tag.index({ id: 1 }),
    });
    const header = screen.getByLabelText(TagsHeaderLabel.Header);
    const details = screen.getByLabelText(TagDetailsLabel.Title);
    await userEvent.click(
      within(details).getByRole("button", {
        name: TagDetailsLabel.DeleteButton,
      })
    );
    expect(
      within(header).queryByRole("button", {
        name: TagsHeaderLabel.CreateButton,
      })
    ).not.toBeInTheDocument();
    expect(
      within(details).queryByRole("button", {
        name: TagDetailsLabel.DeleteButton,
      })
    ).not.toBeInTheDocument();
    expect(
      within(details).queryByRole("link", { name: TagDetailsLabel.EditButton })
    ).not.toBeInTheDocument();
  });

  it("hides buttons when updating tags", () => {
    renderWithBrowserRouter(<Tags />, {
      wrapperProps: { state },
      route: tagURLs.tag.update({ id: 1 }),
    });
    const header = screen.getByLabelText(TagsHeaderLabel.Header);
    const details = screen.getByLabelText(TagUpdateLabel.Form);
    expect(
      within(header).queryByRole("button", {
        name: TagsHeaderLabel.CreateButton,
      })
    ).not.toBeInTheDocument();
    expect(
      within(details).queryByRole("button", {
        name: TagDetailsLabel.DeleteButton,
      })
    ).not.toBeInTheDocument();
    expect(
      within(details).queryByRole("link", { name: TagDetailsLabel.EditButton })
    ).not.toBeInTheDocument();
  });

  it("hides buttons when creating tags", async () => {
    renderWithBrowserRouter(<Tags />, {
      wrapperProps: { state },
      route: tagURLs.tag.index({ id: 1 }),
    });
    const header = screen.getByLabelText(TagsHeaderLabel.Header);
    const details = screen.getByLabelText(TagDetailsLabel.Title);
    await userEvent.click(
      within(header).getByRole("button", { name: TagsHeaderLabel.CreateButton })
    );
    expect(
      within(header).queryByRole("button", {
        name: TagsHeaderLabel.CreateButton,
      })
    ).not.toBeInTheDocument();
    expect(
      within(details).queryByRole("button", {
        name: TagDetailsLabel.DeleteButton,
      })
    ).not.toBeInTheDocument();
    expect(
      within(details).queryByRole("link", { name: TagDetailsLabel.EditButton })
    ).not.toBeInTheDocument();
  });
});
