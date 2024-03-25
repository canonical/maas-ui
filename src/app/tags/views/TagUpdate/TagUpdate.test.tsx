import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagUpdate from "./TagUpdate";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { tagActions } from "@/app/store/tag";
import { Label as KernelOptionsLabel } from "@/app/tags/components/KernelOptionsField";
import { NewDefinitionMessage } from "@/app/tags/constants";
import { Label } from "@/app/tags/views/TagDetails";
import * as factory from "@/testing/factories";
import { mockFormikFormSaved } from "@/testing/mockFormikFormSaved";
import { userEvent, render, screen, waitFor } from "@/testing/utils";

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
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.tags.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <TagUpdate id={1} onClose={vi.fn()} />}
            exact
            path={urls.tags.tag.index(null)}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

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
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.tags.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <TagUpdate id={1} onClose={vi.fn()} />}
            exact
            path={urls.tags.tag.index(null)}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("Spinner")).toBeInTheDocument();
});

it("can update the tag", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <CompatRouter>
          <TagUpdate id={1} onClose={vi.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
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
  await waitFor(() =>
    expect(
      store.getActions().find((action) => action.type === expected.type)
    ).toStrictEqual(expected)
  );
});

it("goes to the tag details page if it can't go back", async () => {
  const history = createMemoryHistory({
    initialEntries: [
      {
        pathname: urls.tags.tag.index({ id: 1 }),
      },
    ],
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <Route
            component={() => <TagUpdate id={1} onClose={vi.fn()} />}
            exact
            path={urls.tags.tag.index(null)}
          />
        </CompatRouter>
      </Router>
    </Provider>
  );
  expect(history.location.pathname).toBe(urls.tags.tag.index({ id: 1 }));
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.Name }),
    "tag1"
  );
  mockFormikFormSaved();
  await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() =>
    expect(history.location.pathname).toBe(urls.tags.tag.index({ id: 1 }))
  );
});

it("shows a confirmation when a tag's definition is updated", async () => {
  const tag = factory.tag({ id: 1, definition: "abc", name: "baggage" });
  state.tag.items = [tag];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <CompatRouter>
          <TagUpdate id={1} onClose={vi.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

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
