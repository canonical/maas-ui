import reduxToolkit from "@reduxjs/toolkit";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { Label as TagFormChangesLabel } from "../TagFormChanges/TagFormChanges";

import TagFormFields, { Label } from "./TagFormFields";

import type { RootState } from "app/store/root/types";
import type { Tag, TagMeta } from "app/store/tag/types";
import { Label as AddTagFormLabel } from "app/tags/components/AddTagForm/AddTagForm";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { tagStateListFactory } from "testing/factories/state";
import { mockFormikFormSaved } from "testing/mockFormikFormSaved";
import {
  userEvent,
  render,
  screen,
  waitFor,
  within,
  renderWithBrowserRouter,
} from "testing/utils";

const mockStore = configureStore();
let state: RootState;
let tags: Tag[];

beforeEach(() => {
  jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
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
      lists: {
        "mocked-nanoid": tagStateListFactory({
          loaded: true,
          items: tags,
        }),
      },
    }),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("displays available tags in the dropdown", async () => {
  renderWithBrowserRouter(
    <Formik initialValues={{ added: [], removed: [] }} onSubmit={jest.fn()}>
      <TagFormFields
        machines={[]}
        newTags={[]}
        selectedCount={state.machine.items.length}
        selectedMachines={{
          items: state.machine.items.map((item) => item.system_id),
        }}
        setNewTags={jest.fn()}
      />
    </Formik>,
    // TODO: remove legacyRoot https://warthogs.atlassian.net/browse/MAASENG-1802
    { state, legacyRoot: true }
  );
  const changes = screen.getByRole("table", {
    name: TagFormChangesLabel.Table,
  });
  const tagRow = within(changes).getByRole("row", {
    name: "tag3",
  });
  // Set a tag to be removed.
  await userEvent.click(
    within(tagRow).getByRole("button", { name: TagFormChangesLabel.Remove })
  );
  // Open the tag selector dropdown.
  await userEvent.click(screen.getByRole("textbox", { name: Label.TagInput }));
  // Set a tag to be added.
  await userEvent.click(
    screen.getByRole("option", {
      name: "tag1",
    })
  );
  await userEvent.click(screen.getByRole("textbox", { name: Label.TagInput }));
  expect(screen.getAllByRole("option")).toHaveLength(1);
  await waitFor(() =>
    expect(screen.getByRole("option", { name: "tag2" })).toBeInTheDocument()
  );
});

it("displays the tags to be added", () => {
  renderWithBrowserRouter(
    <Formik
      initialValues={{ added: [tags[0].id, tags[2].id], removed: [] }}
      onSubmit={jest.fn()}
    >
      <TagFormFields
        machines={[]}
        newTags={[]}
        selectedCount={state.machine.items.length}
        selectedMachines={{
          items: state.machine.items.map((item) => item.system_id),
        }}
        setNewTags={jest.fn()}
      />
    </Formik>,
    { state }
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
  renderWithBrowserRouter(
    <Formik initialValues={{ added: [], removed: [] }} onSubmit={jest.fn()}>
      <TagFormFields
        machines={[]}
        newTags={[]}
        selectedCount={state.machine.items.length}
        setNewTags={jest.fn()}
      />
    </Formik>,
    { state }
  );

  await userEvent.type(
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
  const setNewTags = jest.fn();
  const Form = ({ tags }: { tags: Tag[TagMeta.PK][] }) => (
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <Formik
            initialValues={{ added: tags, removed: [] }}
            onSubmit={jest.fn()}
          >
            <TagFormFields
              machines={state.machine.items}
              newTags={[]}
              selectedCount={state.machine.items.length}
              setNewTags={setNewTags}
            />
          </Formik>
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const { rerender } = render(<Form tags={[]} />);
  expect(
    screen.queryByRole("button", { name: /new-tag/i })
  ).not.toBeInTheDocument();
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.TagInput }),
    "new-tag{enter}"
  );
  mockFormikFormSaved();
  const newTag = tagFactory({ id: 8, name: "new-tag" });
  state.tag.saved = true;
  state.tag.items.push(newTag);
  await userEvent.click(
    screen.getByRole("button", { name: AddTagFormLabel.Submit })
  );
  rerender(<Form tags={[newTag.id]} />);
  const changes = screen.getByRole("table", {
    name: TagFormChangesLabel.Table,
  });
  await waitFor(() =>
    expect(
      within(changes).getByRole("button", { name: /new-tag/i })
    ).toBeInTheDocument()
  );
  expect(setNewTags).toHaveBeenCalledWith([newTag.id]);
});
