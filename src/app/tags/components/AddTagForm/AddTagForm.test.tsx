import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import AddTagForm, { Label } from "./AddTagForm";

import urls from "app/base/urls";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import { Label as KernelOptionsLabel } from "app/tags/components/KernelOptionsField";
import {
  tag as tagFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { mockFormikFormSaved } from "testing/mockFormikFormSaved";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    tag: tagStateFactory(),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("dispatches an action to create a tag", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <CompatRouter>
          <AddTagForm name="new-tag" onTagCreated={jest.fn()} />
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
  const onTagCreated = jest.fn();
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
  const newTag = tagFactory({ id: 8, name: "new-tag" });
  state.tag = tagStateFactory({
    items: [newTag],
    saved: true,
  });
  await userEvent.click(screen.getByRole("button", { name: Label.Submit }));
  await waitFor(() => expect(onTagCreated).toHaveBeenCalledWith(newTag));
});
