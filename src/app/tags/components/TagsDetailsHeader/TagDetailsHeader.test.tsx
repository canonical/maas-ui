import { Route, Routes } from "react-router";
import type { Mock } from "vitest";

import TagsHeader, { Label } from "./TagDetailsHeader";

import urls from "@/app/base/urls";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
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

beforeEach(() => {
  // Mock the scrollTo method as jsdom doesn't support this and will error.
  scrollToSpy = vi.fn();
  global.scrollTo = scrollToSpy;
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("displays edit and delete buttons, and a return link", () => {
  const tag = factory.tag({ id: 1 });
  const state = factory.rootState({
    tag: factory.tagState({
      loaded: true,
      loading: false,
      items: [tag],
    }),
  });
  renderWithProviders(
    <Routes>
      <Route
        element={<TagsHeader onDelete={vi.fn()} onUpdate={vi.fn()} />}
        path={urls.tags.tag.index(null)}
      />
    </Routes>,
    {
      initialEntries: [urls.tags.tag.index({ id: 1 })],
      state,
    }
  );

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
  renderWithProviders(
    <Routes>
      <Route
        element={<TagsHeader onDelete={vi.fn()} onUpdate={onUpdate} />}
        path={urls.tags.tag.index(null)}
      />
    </Routes>,
    { initialEntries: [urls.tags.tag.index({ id: 1 })], state }
  );
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Edit" })).not.toBeAriaDisabled();
  });
  await userEvent.click(screen.getByRole("button", { name: "Edit" }));
  expect(onUpdate).toHaveBeenCalledWith(1);
});

it("enables the edit and delete buttons when the user has edit entitlements", async () => {
  const tag = factory.tag({ id: 1 });
  const state = factory.rootState({
    tag: factory.tagState({
      loaded: true,
      loading: false,
      items: [tag],
    }),
  });
  renderWithProviders(
    <Routes>
      <Route
        element={<TagsHeader onDelete={vi.fn()} onUpdate={vi.fn()} />}
        path={urls.tags.tag.index(null)}
      />
    </Routes>,
    { initialEntries: [urls.tags.tag.index({ id: 1 })], state }
  );

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: Label.EditButton })
    ).not.toBeAriaDisabled();
  });
  expect(
    screen.getByRole("button", { name: Label.DeleteButton })
  ).not.toBeAriaDisabled();
});

it("disables the edit and delete buttons when the user lacks edit entitlements", async () => {
  mockServer.use(authResolvers.getMeEntitlements.handler([]));
  const onUpdate = vi.fn();
  const onDelete = vi.fn();
  const tag = factory.tag({ id: 1 });
  const state = factory.rootState({
    tag: factory.tagState({
      loaded: true,
      loading: false,
      items: [tag],
    }),
  });
  renderWithProviders(
    <Routes>
      <Route
        element={<TagsHeader onDelete={onDelete} onUpdate={onUpdate} />}
        path={urls.tags.tag.index(null)}
      />
    </Routes>,
    { initialEntries: [urls.tags.tag.index({ id: 1 })], state }
  );

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: Label.EditButton })
    ).toBeAriaDisabled();
  });
  expect(
    screen.getByRole("button", { name: Label.DeleteButton })
  ).toBeAriaDisabled();

  await userEvent.click(screen.getByRole("button", { name: Label.EditButton }));
  await userEvent.click(
    screen.getByRole("button", { name: Label.DeleteButton })
  );
  expect(onUpdate).not.toHaveBeenCalled();
  expect(onDelete).not.toHaveBeenCalled();
});
