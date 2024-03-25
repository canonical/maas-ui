import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddTagForm, { Label } from "./AddTagForm";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { tagActions } from "@/app/store/tag";
import { Label as KernelOptionsLabel } from "@/app/tags/components/KernelOptionsField";
import * as factory from "@/testing/factories";
import { mockFormikFormSaved } from "@/testing/mockFormikFormSaved";
import { userEvent, render, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = factory.rootState({
    tag: factory.tagState(),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("dispatches an action to create a tag", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <CompatRouter>
          <AddTagForm name="new-tag" onTagCreated={vi.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.Comment }),
    "comment1"
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: KernelOptionsLabel.KernelOptions }),
    "options1"
  );
  await userEvent.click(screen.getByRole("button", { name: Label.Submit }));
  const expected = tagActions.create({
    comment: "comment1",
    kernel_opts: "options1",
    name: "new-tag",
  });
  await waitFor(() =>
    expect(
      store.getActions().find((action) => action.type === expected.type)
    ).toStrictEqual(expected)
  );
});

it("returns the newly created tag on save", async () => {
  const onTagCreated = vi.fn();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <CompatRouter>
          <Route
            component={() => (
              <AddTagForm name="new-tag" onTagCreated={onTagCreated} />
            )}
            exact
            path={urls.tags.index}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  mockFormikFormSaved();
  const newTag = factory.tag({ id: 8, name: "new-tag" });
  state.tag = factory.tagState({
    items: [newTag],
    saved: true,
  });
  await userEvent.click(screen.getByRole("button", { name: Label.Submit }));
  await waitFor(() => expect(onTagCreated).toHaveBeenCalledWith(newTag));
});
