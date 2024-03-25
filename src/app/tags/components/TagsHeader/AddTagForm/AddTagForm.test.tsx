import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddTagForm, { Label } from "./AddTagForm";

import * as analyticsHooks from "@/app/base/hooks/analytics";
import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { tagActions } from "@/app/store/tag";
import { Label as DefinitionLabel } from "@/app/tags/components/DefinitionField";
import { Label as KernelOptionsLabel } from "@/app/tags/components/KernelOptionsField";
import { NewDefinitionMessage } from "@/app/tags/constants";
import * as factory from "@/testing/factories";
import { mockFormikFormSaved } from "@/testing/mockFormikFormSaved";
import {
  userEvent,
  render,
  screen,
  waitFor,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = factory.rootState({
    tag: factory.tagState(),
  });
});

it("dispatches an action to create a tag", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <CompatRouter>
          <AddTagForm onClose={vi.fn()} />
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
  const onClose = vi.fn();
  renderWithBrowserRouter(<AddTagForm onClose={onClose} />, {
    route: urls.tags.index,
    state,
  });
  expect(window.location.pathname).toBe(urls.tags.index);
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.Name }),
    "tag1"
  );

  mockFormikFormSaved();
  state.tag = factory.tagState({
    items: [factory.tag({ id: 8, name: "tag1" })],
    saved: true,
  });
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  await vi.waitFor(() => {
    expect(window.location.pathname).toBe(urls.tags.tag.index({ id: 8 }));
  });
  expect(onClose).toBeCalled();
});

it("sends analytics when there is a definition", async () => {
  const mockSendAnalytics = vi.fn();
  vi.spyOn(analyticsHooks, "useSendAnalytics").mockImplementation(
    () => mockSendAnalytics
  );
  const onClose = vi.fn();
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
  state.tag = factory.tagState({
    items: [factory.tag({ id: 8, name: "tag1", definition: "def1" })],
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
  const mockSendAnalytics = vi.fn();
  vi.spyOn(analyticsHooks, "useSendAnalytics").mockImplementation(
    () => mockSendAnalytics
  );
  const onClose = vi.fn();
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
  state.tag = factory.tagState({
    items: [factory.tag({ id: 8, name: "tag1" })],
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
          <AddTagForm onClose={vi.fn()} />
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
          <AddTagForm onClose={vi.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  const nameInput = screen.getByRole("textbox", { name: Label.Name });
  await userEvent.type(nameInput, "invalid name");
  await userEvent.tab();

  await waitFor(() =>
    expect(nameInput).toHaveAccessibleErrorMessage(
      `Error: ${Label.NameValidation}`
    )
  );
});
