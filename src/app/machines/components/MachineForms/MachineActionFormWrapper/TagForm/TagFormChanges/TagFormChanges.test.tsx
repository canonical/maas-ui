import * as reduxToolkit from "@reduxjs/toolkit";
import { Formik } from "formik";

import TagFormChanges, { Label } from "./TagFormChanges";

import * as query from "@/app/store/machine/utils/query";
import type { RootState } from "@/app/store/root/types";
import type { Tag } from "@/app/store/tag/types";
import * as factory from "@/testing/factories";
import { tagStateListFactory } from "@/testing/factories/state";
import {
  userEvent,
  screen,
  waitFor,
  within,
  renderWithProviders,
} from "@/testing/utils";

let state: RootState;
let tags: Tag[];
const commonProps = {
  selectedCount: 0,
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
  ];

  state = factory.rootState({
    machine: factory.machineState({
      items: [
        factory.machine({ tags: [1] }),
        factory.machine({ tags: [1, 2] }),
      ],
    }),
    tag: factory.tagState({
      items: tags,
      lists: {
        "mocked-nanoid": tagStateListFactory({
          items: [
            factory.tag({ id: 1, name: "tag1" }),
            factory.tag({ id: 2, name: "tag2" }),
          ],
          loaded: true,
        }),
      },
    }),
  });
});

const getTable = () => screen.getByRole("grid", { name: Label.Table });

const findRowByTagName = (tagName: string) =>
  within(getTable())
    .getAllByRole("row")
    .find((row) => {
      try {
        // Tag name appears inside a Chip with value like "tag1 (1/2)"
        return within(row).getByText(new RegExp(`^${tagName}\\s`));
      } catch {
        return false;
      }
    })!;

const getRowByTagName = (tagName: string) =>
  within(getTable())
    .getAllByRole("row")
    .find((row) => {
      try {
        return within(row).getByText(new RegExp(`^${tagName}\\s`));
      } catch {
        return false;
      }
    })!;

it("displays manual tags", () => {
  tags[0].definition = "";
  tags[1].definition = "";

  renderWithProviders(
    <Formik initialValues={{ added: [], removed: [] }} onSubmit={vi.fn()}>
      <TagFormChanges {...commonProps} newTags={[]} tags={tags} />
    </Formik>,
    { state }
  );
  const table = getTable();
  // Each manual tag row should have the "Currently assigned" category label
  expect(
    within(table).getAllByRole("cell", { name: Label.Manual })
  ).toHaveLength(2);
  expect(findRowByTagName("tag1")).toBeTruthy();
  expect(findRowByTagName("tag2")).toBeTruthy();
});

it("displays automatic tags", () => {
  tags[0].definition = "def1";
  tags[1].definition = "def2";

  renderWithProviders(
    <Formik initialValues={{ added: [], removed: [] }} onSubmit={vi.fn()}>
      <TagFormChanges {...commonProps} newTags={[]} tags={tags} />
    </Formik>,
    { state }
  );
  const table = getTable();
  // Each automatic tag row should have the "Automatic tags" category label
  expect(
    within(table).getAllByRole("cell", { name: Label.Automatic })
  ).toHaveLength(2);
  expect(findRowByTagName("tag1")).toBeTruthy();
  expect(findRowByTagName("tag2")).toBeTruthy();
});

it("displays added tags, with a 'NEW' prefix for newly created tags", () => {
  renderWithProviders(
    <Formik
      initialValues={{ added: [tags[0].id, tags[1].id], removed: [] }}
      onSubmit={vi.fn()}
    >
      <TagFormChanges {...commonProps} newTags={[tags[1].id]} tags={tags} />
    </Formik>,
    { state }
  );
  const table = getTable();
  // Each added tag row should have the "To be added" category label
  expect(
    within(table).getAllByRole("cell", { name: Label.Added })
  ).toHaveLength(2);
  const existingTagRow = getRowByTagName("tag1");
  const newTagRow = getRowByTagName("tag2");
  expect(within(existingTagRow).queryByText("New")).not.toBeInTheDocument();
  expect(within(newTagRow).getByText("NEW")).toBeInTheDocument();
});

it("discards added tags", async () => {
  renderWithProviders(
    <Formik
      initialValues={{ added: [tags[0].id, tags[1].id], removed: [] }}
      onSubmit={vi.fn()}
    >
      <TagFormChanges {...commonProps} newTags={[]} tags={[]} />
    </Formik>,
    { state }
  );
  const row = getRowByTagName("tag1");
  await userEvent.click(
    within(row).getByRole("button", { name: Label.Discard })
  );
  await waitFor(() => {
    expect(screen.queryByText("tag1")).not.toBeInTheDocument();
  });
});

it("displays a tag details modal when chips are clicked", async () => {
  const expectedTag = tags[0];
  expectedTag.name = "tag1";
  expectedTag.machine_count = 2;

  const handleToggleTagDetails = vi.fn();
  renderWithProviders(
    <Formik initialValues={{ added: [], removed: [] }} onSubmit={vi.fn()}>
      <TagFormChanges
        newTags={[]}
        selectedCount={2}
        tags={tags}
        toggleTagDetails={handleToggleTagDetails}
      />
    </Formik>,
    { state }
  );
  await userEvent.click(
    screen.getByRole("button", { name: `${expectedTag.name} (2/2)` })
  );
  expect(handleToggleTagDetails).toHaveBeenCalledWith(expectedTag);
});

it("can remove manual tags", async () => {
  renderWithProviders(
    <Formik initialValues={{ added: [], removed: [] }} onSubmit={vi.fn()}>
      <TagFormChanges {...commonProps} newTags={[]} tags={tags} />
    </Formik>,
    { state }
  );
  const tagName = "tag1";
  const manualRow = getRowByTagName(tagName);
  // The row should have the "Currently assigned" category label
  expect(
    within(manualRow).getByRole("cell", { name: Label.Manual })
  ).toBeInTheDocument();
  await userEvent.click(
    within(manualRow).getByRole("button", { name: Label.Remove })
  );
  // After removing, the tag should now appear in the "To be removed" category
  const updatedRow = getRowByTagName(tagName);
  await waitFor(() => {
    expect(
      within(updatedRow).getByRole("cell", { name: Label.Removed })
    ).toBeInTheDocument();
  });
});

it("displays removed tags", () => {
  const tags = state.tag.items;

  renderWithProviders(
    <Formik
      initialValues={{ added: [], removed: [tags[0].id, tags[1].id] }}
      onSubmit={vi.fn()}
    >
      <TagFormChanges {...commonProps} newTags={[]} tags={[]} />
    </Formik>,
    { state }
  );
  const table = getTable();
  // Each removed tag row should have the "To be removed" category label
  expect(
    within(table).getAllByRole("cell", { name: Label.Removed })
  ).toHaveLength(2);
  expect(findRowByTagName("tag1")).toBeTruthy();
  expect(findRowByTagName("tag2")).toBeTruthy();
});

it("discards removed tags", async () => {
  renderWithProviders(
    <Formik
      initialValues={{ added: [], removed: [tags[0].id, tags[1].id] }}
      onSubmit={vi.fn()}
    >
      <TagFormChanges {...commonProps} newTags={[]} tags={tags} />
    </Formik>,
    { state }
  );
  const row = getRowByTagName("tag1");
  // The row should have the "To be removed" category label
  expect(
    within(row).getByRole("cell", { name: Label.Removed })
  ).toBeInTheDocument();
  await userEvent.click(
    within(row).getByRole("button", { name: Label.Discard })
  );
  // After discarding, the tag should now appear in the "Currently assigned" category
  const updatedRow = getRowByTagName("tag1");
  await waitFor(() => {
    expect(
      within(updatedRow).getByRole("cell", { name: Label.Manual })
    ).toBeInTheDocument();
  });
});

it("shows a message if no tags are assigned to the selected machines", () => {
  const state = factory.rootState({
    machine: factory.machineState({
      items: [factory.machine({ tags: [] }), factory.machine({ tags: [] })],
      loaded: true,
      loading: false,
    }),
    tag: factory.tagState({
      items: [factory.tag(), factory.tag()],
      loaded: true,
      loading: false,
    }),
  });

  renderWithProviders(
    <Formik initialValues={{ added: [], removed: [] }} onSubmit={vi.fn()}>
      <TagFormChanges {...commonProps} newTags={[]} tags={tags} />
    </Formik>,
    { state }
  );

  expect(screen.getByText(Label.NoTags)).toBeInTheDocument();
});
