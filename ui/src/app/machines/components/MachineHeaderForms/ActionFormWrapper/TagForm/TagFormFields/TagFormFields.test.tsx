import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { Label as AddTagFormLabel } from "../AddTagForm/AddTagForm";
import { Label as TagFormChangesLabel } from "../TagFormChanges/TagFormChanges";

import TagFormFields, { Label } from "./TagFormFields";

import * as baseHooks from "app/base/hooks/base";
import type { RootState } from "app/store/root/types";
import type { Tag, TagMeta } from "app/store/tag/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();
let state: RootState;
let tags: Tag[];

beforeEach(() => {
  tags = [
    tagFactory({ id: 1, name: "tag1" }),
    tagFactory({ id: 2, name: "tag2" }),
    tagFactory({ id: 3, name: "tag3" }),
  ];
  state = rootStateFactory({
    machine: machineStateFactory({
      items: [
        machineFactory({
          tags: [],
        }),
      ],
    }),
    tag: tagStateFactory({
      items: tags,
    }),
  });
  jest
    .spyOn(baseHooks, "useCycled")
    .mockImplementation(() => [false, () => null]);
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("displays available tags in the dropdown", async () => {
  state.machine.items[0].tags = [3];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{ added: [], removed: [] }} onSubmit={jest.fn()}>
          <TagFormFields machines={state.machine.items} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  const changes = screen.getByRole("table", {
    name: TagFormChangesLabel.Table,
  });
  const tagRow = within(changes).getByRole("row", {
    name: "tag3",
  });
  // Set a tag to be removed.
  userEvent.click(
    within(tagRow).getByRole("button", { name: TagFormChangesLabel.Remove })
  );
  // Open the tag selector dropdown.
  screen.getByRole("textbox", { name: Label.TagInput }).focus();
  // Set a tag to be added.
  userEvent.click(
    screen.getByRole("option", {
      name: "tag1",
    })
  );
  expect(screen.getAllByRole("option")).toHaveLength(1);
  await waitFor(() =>
    expect(screen.getByRole("option", { name: "tag2" })).toBeInTheDocument()
  );
});

it("displays the new tags", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik
          initialValues={{ added: [tags[0].id, tags[2].id], removed: [] }}
          onSubmit={jest.fn()}
        >
          <TagFormFields machines={state.machine.items} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  const changes = screen.getByRole("table", {
    name: TagFormChangesLabel.Table,
  });
  expect(
    within(changes).getByRole("button", { name: "tag1 (1/1)" })
  ).toBeInTheDocument();
  expect(
    within(changes).getByRole("button", { name: "tag3 (1/1)" })
  ).toBeInTheDocument();
});

it("can open a create tag form", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{ added: [], removed: [] }} onSubmit={jest.fn()}>
          <TagFormFields machines={[]} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  userEvent.type(
    screen.getByRole("textbox", { name: Label.TagInput }),
    "name1{enter}"
  );
  await waitFor(() =>
    expect(
      screen.getByRole("dialog", { name: Label.AddTag })
    ).toBeInTheDocument()
  );
});

it("updates the new tags after creating a tag", async () => {
  const store = mockStore(state);
  const Form = ({ tags }: { tags: Tag[TagMeta.PK][] }) => (
    <Provider store={store}>
      <MemoryRouter>
        <Formik
          initialValues={{ added: tags, removed: [] }}
          onSubmit={jest.fn()}
        >
          <TagFormFields machines={state.machine.items} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  const { rerender } = render(<Form tags={[]} />);
  expect(
    screen.queryByRole("button", { name: /new-tag/i })
  ).not.toBeInTheDocument();
  userEvent.type(
    screen.getByRole("textbox", { name: Label.TagInput }),
    "new-tag{enter}"
  );
  // Simulate the state.tag.saved state going from `save: false` to `saved:
  // true` which happens when the tag is successfully saved. This in turn will
  // mean that the form `onSuccess` prop will get called so that the component
  // knows that the tag was created.
  jest
    .spyOn(baseHooks, "useCycled")
    .mockImplementation(() => [true, () => null]);
  const newTag = tagFactory({ id: 8, name: "new-tag" });
  state.tag.saved = true;
  state.tag.items.push(newTag);
  fireEvent.submit(screen.getByRole("form", { name: AddTagFormLabel.Form }));
  rerender(<Form tags={[newTag.id]} />);
  const changes = screen.getByRole("table", {
    name: TagFormChangesLabel.Table,
  });
  await waitFor(() =>
    expect(
      within(changes).getByRole("button", { name: /new-tag/i })
    ).toBeInTheDocument()
  );
});
