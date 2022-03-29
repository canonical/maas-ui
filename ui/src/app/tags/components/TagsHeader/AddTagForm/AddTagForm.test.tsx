import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Router } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddTagForm, { Label } from "./AddTagForm";

import * as analyticsHooks from "app/base/hooks/analytics";
import * as baseHooks from "app/base/hooks/base";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import { Label as DefinitionLabel } from "app/tags/components/DefinitionField";
import { Label as KernelOptionsLabel } from "app/tags/components/KernelOptionsField";
import tagsURLs from "app/tags/urls";
import {
  tag as tagFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    tag: tagStateFactory(),
  });
  jest
    .spyOn(baseHooks, "useCycled")
    .mockImplementation(() => [false, () => null]);
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("dispatches an action to create a tag", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <AddTagForm onClose={jest.fn()} />
      </MemoryRouter>
    </Provider>
  );
  userEvent.type(screen.getByRole("textbox", { name: Label.Name }), "name1");
  userEvent.type(
    screen.getByRole("textbox", { name: DefinitionLabel.Definition }),
    "definition1"
  );
  userEvent.type(
    screen.getByRole("textbox", { name: Label.Comment }),
    "comment1"
  );
  userEvent.type(
    screen.getByRole("textbox", { name: KernelOptionsLabel.KernelOptions }),
    "options1"
  );
  fireEvent.submit(screen.getByRole("form"));
  const expected = tagActions.create({
    comment: "comment1",
    definition: "definition1",
    kernel_opts: "options1",
    name: "name1",
  });
  await waitFor(() =>
    expect(
      store.getActions().find((action) => action.type === expected.type)
    ).toStrictEqual(expected)
  );
});

it("redirects to the newly created tag on save", async () => {
  const history = createMemoryHistory({
    initialEntries: [{ pathname: tagsURLs.tags.index }],
  });
  const onClose = jest.fn();
  const store = mockStore(state);
  const TagForm = () => (
    <Provider store={store}>
      <Router history={history}>
        <Route
          exact
          path={tagsURLs.tags.index}
          component={() => <AddTagForm onClose={onClose} />}
        />
      </Router>
    </Provider>
  );
  render(<TagForm />);
  expect(history.location.pathname).toBe(tagsURLs.tags.index);
  userEvent.type(screen.getByRole("textbox", { name: Label.Name }), "tag1");
  // Simulate the state.tag.saved state going from `save: false` to `saved:
  // true` which happens when the tag is successfully saved. This in turn will
  // mean that the form `onSuccess` prop will get called so that the component
  // knows that the tag was created.
  jest
    .spyOn(baseHooks, "useCycled")
    .mockImplementation(() => [true, () => null]);
  state.tag = tagStateFactory({
    items: [tagFactory({ id: 8, name: "tag1" })],
    saved: true,
  });
  fireEvent.submit(screen.getByRole("form"));
  expect(history.location.pathname).toBe(tagsURLs.tag.index({ id: 8 }));
  expect(onClose).toBeCalled();
});

it("sends analytics when there is a definition", async () => {
  const mockSendAnalytics = jest.fn();
  jest
    .spyOn(analyticsHooks, "useSendAnalytics")
    .mockImplementation(() => mockSendAnalytics);
  const onClose = jest.fn();
  const store = mockStore(state);
  const TagForm = () => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <AddTagForm onClose={onClose} />
      </MemoryRouter>
    </Provider>
  );
  render(<TagForm />);
  userEvent.type(screen.getByRole("textbox", { name: Label.Name }), "tag1");
  // Simulate the state.tag.saved state going from `save: false` to `saved:
  // true` which happens when the tag is successfully saved. This in turn will
  // mean that the form `onSuccess` prop will get called so that the component
  // knows that the tag was created.
  jest
    .spyOn(baseHooks, "useCycled")
    .mockImplementation(() => [true, () => null]);
  state.tag = tagStateFactory({
    items: [tagFactory({ id: 8, name: "tag1", definition: "def1" })],
    saved: true,
  });
  fireEvent.submit(screen.getByRole("form"));
  await waitFor(() => {
    expect(mockSendAnalytics).toHaveBeenCalled();
  });
  expect(mockSendAnalytics.mock.calls[0]).toEqual([
    "XPath tagging",
    "Valid XPath",
    "Save",
  ]);
});

it("sends analytics when there is no definition", async () => {
  const mockSendAnalytics = jest.fn();
  jest
    .spyOn(analyticsHooks, "useSendAnalytics")
    .mockImplementation(() => mockSendAnalytics);
  const onClose = jest.fn();
  const store = mockStore(state);
  const TagForm = () => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <AddTagForm onClose={onClose} />
      </MemoryRouter>
    </Provider>
  );
  render(<TagForm />);
  userEvent.type(screen.getByRole("textbox", { name: Label.Name }), "tag1");
  // Simulate the state.tag.saved state going from `save: false` to `saved:
  // true` which happens when the tag is successfully saved. This in turn will
  // mean that the form `onSuccess` prop will get called so that the component
  // knows that the tag was created.
  jest
    .spyOn(baseHooks, "useCycled")
    .mockImplementation(() => [true, () => null]);
  state.tag = tagStateFactory({
    items: [tagFactory({ id: 8, name: "tag1" })],
    saved: true,
  });
  fireEvent.submit(screen.getByRole("form"));
  await waitFor(() => {
    expect(mockSendAnalytics).toHaveBeenCalled();
  });
  expect(mockSendAnalytics.mock.calls[0]).toEqual([
    "Create Tag form",
    "Manual tag created",
    "Save",
  ]);
});
