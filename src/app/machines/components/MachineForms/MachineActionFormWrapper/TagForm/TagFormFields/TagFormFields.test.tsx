import * as reduxToolkit from "@reduxjs/toolkit";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import { Label as TagFormChangesLabel } from "../TagFormChanges/TagFormChanges";

import TagFormFields, { Label } from "./TagFormFields";

import * as query from "@/app/store/machine/utils/query";
import type { RootState } from "@/app/store/root/types";
import type { Tag, TagMeta } from "@/app/store/tag/types";
import * as factory from "@/testing/factories";
import { tagStateListFactory } from "@/testing/factories/state";
import {
  userEvent,
  render,
  screen,
  waitFor,
  within,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore();
let state: RootState;
let tags: Tag[];
const commonProps = {
  setSecondaryContent: vi.fn(),
  setNewTagName: vi.fn(),
  toggleTagDetails: vi.fn(),
};

vi.mock("@reduxjs/toolkit", async () => {
  const actual: object = await vi.importActual("@reduxjs/toolkit");
  return {
    ...actual,
    nanoid: vi.fn(),
  };
});

beforeEach(() => {
  vi.spyOn(query, "generateCallId").mockReturnValue("mocked-nanoid");
  vi.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
  tags = [
    factory.tag({ id: 1, name: "tag1" }),
    factory.tag({ id: 2, name: "tag2" }),
    factory.tag({ id: 3, name: "tag3" }),
  ];
  state = factory.rootState({
    machine: factory.machineState({
      items: [
        factory.machine({
          system_id: "abc123",
          tags: [3],
        }),
      ],
    }),
    tag: factory.tagState({
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
  vi.restoreAllMocks();
});

it("displays available tags in the dropdown", async () => {
  renderWithBrowserRouter(
    <Formik initialValues={{ added: [], removed: [] }} onSubmit={vi.fn()}>
      <TagFormFields
        {...commonProps}
        machines={[]}
        newTags={[]}
        selectedCount={state.machine.items.length}
        selectedMachines={{
          items: state.machine.items.map((item) => item.system_id),
        }}
        setNewTags={vi.fn()}
      />
    </Formik>,
    { state }
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
      onSubmit={vi.fn()}
    >
      <TagFormFields
        {...commonProps}
        machines={[]}
        newTags={[]}
        selectedCount={state.machine.items.length}
        selectedMachines={{
          items: state.machine.items.map((item) => item.system_id),
        }}
        setNewTags={vi.fn()}
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

it("updates the new tags after creating a tag", async () => {
  const machines = [factory.machine({ system_id: "abc123", tags: [1] })];
  const store = mockStore(state);
  const setNewTags = vi.fn();
  const Form = ({ tags }: { tags: Tag[TagMeta.PK][] }) => (
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{ added: tags, removed: [] }} onSubmit={vi.fn()}>
          <TagFormFields
            {...commonProps}
            machines={state.machine.items}
            newTags={tags}
            selectedCount={state.machine.items.length}
            selectedMachines={{
              items: machines.map((item) => item.system_id),
            }}
            setNewTags={setNewTags}
            viewingDetails={false}
          />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  const { rerender } = render(<Form tags={[]} />);
  const changes = screen.getByRole("table", {
    name: TagFormChangesLabel.Table,
  });
  const newTag = factory.tag({ id: 8, name: "new-tag" });
  state.tag.saved = true;
  state.tag.items.push(newTag);
  expect(
    within(changes).queryByRole("button", { name: /new-tag/i })
  ).not.toBeInTheDocument();
  rerender(<Form tags={[newTag.id]} />);

  await waitFor(() =>
    expect(
      within(changes).getByRole("button", { name: /new-tag/i })
    ).toBeInTheDocument()
  );
});
