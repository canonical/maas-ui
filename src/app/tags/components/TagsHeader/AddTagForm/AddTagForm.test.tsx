import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import AddTagForm, { Label } from "./AddTagForm";

import * as analyticsHooks from "app/base/hooks/analytics";
import urls from "app/base/urls";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import { Label as DefinitionLabel } from "app/tags/components/DefinitionField";
import { Label as KernelOptionsLabel } from "app/tags/components/KernelOptionsField";
import { NewDefinitionMessage } from "app/tags/constants";
import {
  tag as tagFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { mockFormikFormSaved } from "testing/mockFormikFormSaved";
import { userEvent, render, screen, waitFor } from "testing/utils";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    tag: tagStateFactory(),
  });
});

it("dispatches an action to create a tag", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <CompatRouter>
          <AddTagForm onClose={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.Name }),
    "name1"
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: DefinitionLabel.Definition }),
    "definition1"
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.Comment }),
    "comment1"
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: KernelOptionsLabel.KernelOptions }),
    "options1"
  );
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
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
    initialEntries: [{ pathname: urls.tags.index }],
  });
  const onClose = jest.fn();
  const store = mockStore(state);
  const TagForm = () => (
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <Route
            component={() => <AddTagForm onClose={onClose} />}
            exact
            path={urls.tags.index}
          />
        </CompatRouter>
      </Router>
    </Provider>
  );
  render(<TagForm />);
  expect(history.location.pathname).toBe(urls.tags.index);
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.Name }),
    "tag1"
  );

  mockFormikFormSaved();
  state.tag = tagStateFactory({
    items: [tagFactory({ id: 8, name: "tag1" })],
    saved: true,
  });
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(history.location.pathname).toBe(urls.tags.tag.index({ id: 8 }));
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
        <CompatRouter>
          <AddTagForm onClose={onClose} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  render(<TagForm />);
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.Name }),
    "tag1"
  );

  mockFormikFormSaved();
  state.tag = tagStateFactory({
    items: [tagFactory({ id: 8, name: "tag1", definition: "def1" })],
    saved: true,
  });
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
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
        <CompatRouter>
          <AddTagForm onClose={onClose} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  render(<TagForm />);
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.Name }),
    "tag1"
  );

  mockFormikFormSaved();
  state.tag = tagStateFactory({
    items: [tagFactory({ id: 8, name: "tag1" })],
    saved: true,
  });
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => {
    expect(mockSendAnalytics).toHaveBeenCalled();
  });
  expect(mockSendAnalytics.mock.calls[0]).toEqual([
    "Create Tag form",
    "Manual tag created",
    "Save",
  ]);
});

it("shows a confirmation when an automatic tag is added", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <CompatRouter>
          <AddTagForm onClose={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.type(
    screen.getByRole("textbox", { name: Label.Name }),
    "name1"
  );
  await userEvent.type(
    screen.getByRole("textbox", {
      name: DefinitionLabel.Definition,
    }),
    "definition"
  );
  // Mock state.tag.saved transitioning from "false" to "true"
  mockFormikFormSaved();
  await userEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => {
    const action = store
      .getActions()
      .find((action) => action.type === "message/add");
    const strippedMessage = action.payload.message.replace(/\s+/g, " ").trim();
    expect(strippedMessage).toBe(`Created name1. ${NewDefinitionMessage}`);
  });
});

it("shows an error if tag name is invalid", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <CompatRouter>
          <AddTagForm onClose={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  const nameInput = screen.getByRole("textbox", { name: Label.Name });
  await userEvent.type(nameInput, "invalid name");
  await userEvent.tab();

  await waitFor(() =>
    expect(nameInput).toHaveErrorMessage(`Error: ${Label.NameValidation}`)
  );
});
