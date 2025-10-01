import configureStore from "redux-mock-store";

import TagUpdate from "./UpdateTagForm";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { tagActions } from "@/app/store/tag";
import { Label as KernelOptionsLabel } from "@/app/tags/components/KernelOptionsField";
import { NewDefinitionMessage } from "@/app/tags/constants";
import { Label } from "@/app/tags/views/TagDetails";
import * as factory from "@/testing/factories";
import { mockFormikFormSaved } from "@/testing/mockFormikFormSaved";
import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  state = factory.rootState({
    tag: factory.tagState({
      items: [
        factory.tag({
          id: 1,
          name: "rad",
        }),
      ],
    }),
  });
});

it("dispatches actions to fetch necessary data", () => {
  const store = mockStore(state);
  renderWithProviders(<TagUpdate id={1} />, { store });

  const expectedActions = [tagActions.fetch()];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});

it("shows a spinner if the tag has not loaded yet", () => {
  const state = factory.rootState({
    tag: factory.tagState({
      items: [],
      loading: true,
    }),
  });
  renderWithProviders(<TagUpdate id={1} />, { state });

  expect(screen.getByTestId("Spinner")).toBeInTheDocument();
});

it("can update the tag", async () => {
  const store = mockStore(state);
  renderWithProviders(<TagUpdate id={1} />, { store });
  const nameInput = screen.getByRole("textbox", { name: Label.Name });
  await userEvent.clear(nameInput);
  await userEvent.type(nameInput, "name1");
  const commentInput = screen.getByRole("textbox", { name: Label.Comment });
  await userEvent.clear(commentInput);
  await userEvent.type(commentInput, "comment1");
  const optionsInput = screen.getByRole("textbox", {
    name: KernelOptionsLabel.KernelOptions,
  });
  await userEvent.clear(optionsInput);
  await userEvent.type(optionsInput, "options1");
  await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
  const expected = tagActions.update({
    id: 1,
    comment: "comment1",
    definition: "",
    kernel_opts: "options1",
    name: "name1",
  });
  await waitFor(() => {
    expect(
      store.getActions().find((action) => action.type === expected.type)
    ).toStrictEqual(expected);
  });
});

it("goes to the tag details page if it can't go back", async () => {
  const store = mockStore(state);
  const { router } = renderWithProviders(<TagUpdate id={1} />, {
    store,
    initialEntries: [urls.tags.tag.index({ id: 1 })],
  });
  expect(router.state.location.pathname).toBe(urls.tags.tag.index({ id: 1 }));
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.Name }),
    "tag1"
  );
  mockFormikFormSaved();
  await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => {
    expect(router.state.location.pathname).toBe(urls.tags.tag.index({ id: 1 }));
  });
});

it("shows a confirmation when a tag's definition is updated", async () => {
  const tag = factory.tag({ id: 1, definition: "abc", name: "baggage" });
  state.tag.items = [tag];
  const store = mockStore(state);
  renderWithProviders(<TagUpdate id={1} />, { store });

  const definitionInput = screen.getByRole("textbox", {
    name: Label.Definition,
  });
  await userEvent.clear(definitionInput);
  await userEvent.type(definitionInput, "def");
  mockFormikFormSaved();
  await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

  await waitFor(() => {
    const action = store
      .getActions()
      .find((action) => action.type === "message/add");
    const strippedMessage = action.payload?.message.replace(/\s+/g, " ").trim();
    expect(strippedMessage).toBe(`Updated baggage. ${NewDefinitionMessage}`);
  });
});
