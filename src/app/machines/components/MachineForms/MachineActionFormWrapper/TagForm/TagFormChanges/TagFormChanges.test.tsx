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
        expect(
          within(row).getByText(new RegExp(`^${tagName}\\s`))
        ).toBeInTheDocument();
        return true;
      } catch {
        return false;
      }
    })!;

const getRowByTagName = (tagName: string) =>
  within(getTable())
    .getAllByRole("row")
    .find((row) => {
      try {
        expect(
          within(row).getByText(new RegExp(`^${tagName}\\s`))
        ).toBeInTheDocument();
        return true;
      } catch {
        return false;
      }
    })!;

/** Check if a tag row is under a given group by verifying the group row
 * appears before the tag row in the row list. */
const isTagUnderGroup = (tagName: string, groupLabel: string) => {
  const rows = within(getTable()).getAllByRole("row");
  const groupIndex = rows.findIndex((row) => {
    try {
      expect(within(row).getByText(groupLabel)).toBeInTheDocument();
      return true;
    } catch {
      return false;
    }
  });
  const tagIndex = rows.findIndex((row) => {
    try {
      expect(
        within(row).getByText(new RegExp(`^${tagName}\\s`))
      ).toBeInTheDocument();
      return true;
    } catch {
      return false;
    }
  });
  // Tag must come after the group row
  return groupIndex !== -1 && tagIndex !== -1 && tagIndex > groupIndex;
};

describe("TagFormChanges", () => {
  describe("display", () => {
    it("displays the correct column headers", () => {
      renderWithProviders(
        <Formik initialValues={{ added: [], removed: [] }} onSubmit={vi.fn()}>
          <TagFormChanges {...commonProps} newTags={[]} tags={tags} />
        </Formik>,
        { state }
      );
      ["name", "kernel options", "action"].forEach((column) => {
        expect(
          screen.getByRole("columnheader", {
            name: new RegExp(`^${column}`, "i"),
          })
        ).toBeInTheDocument();
      });
    });

    it("displays manual tags", () => {
      tags[0].definition = "";
      tags[1].definition = "";

      renderWithProviders(
        <Formik initialValues={{ added: [], removed: [] }} onSubmit={vi.fn()}>
          <TagFormChanges {...commonProps} newTags={[]} tags={tags} />
        </Formik>,
        { state }
      );
      // The "Currently assigned" group label should appear once
      expect(screen.getByText(Label.Manual)).toBeInTheDocument();
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
      // The "Automatic tags" group label should appear once
      expect(screen.getByText(Label.Automatic)).toBeInTheDocument();
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
      // The "To be added" group label should appear once
      expect(screen.getByText(Label.Added)).toBeInTheDocument();
      const existingTagRow = getRowByTagName("tag1");
      const newTagRow = getRowByTagName("tag2");
      expect(within(existingTagRow).queryByText("New")).not.toBeInTheDocument();
      expect(within(newTagRow).getByText("NEW")).toBeInTheDocument();
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
      // The "To be removed" group label should appear once
      expect(screen.getByText(Label.Removed)).toBeInTheDocument();
      expect(findRowByTagName("tag1")).toBeTruthy();
      expect(findRowByTagName("tag2")).toBeTruthy();
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
  });

  describe("actions", () => {
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
        screen.getByRole("button", {
          name: `${expectedTag.name} (2/2)`,
        })
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
      // The tag should be under the "Currently assigned" group
      expect(isTagUnderGroup(tagName, Label.Manual)).toBe(true);
      const manualRow = getRowByTagName(tagName);
      await userEvent.click(
        within(manualRow).getByRole("button", { name: Label.Remove })
      );
      // After removing, the tag should now be under the "To be removed" group
      await waitFor(() => {
        expect(isTagUnderGroup(tagName, Label.Removed)).toBe(true);
      });
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
      const tagName = "tag1";
      // The tag should be under the "To be removed" group
      expect(isTagUnderGroup(tagName, Label.Removed)).toBe(true);
      const row = getRowByTagName(tagName);
      await userEvent.click(
        within(row).getByRole("button", { name: Label.Discard })
      );
      // After discarding, the tag should now be under the
      // "Currently assigned" group
      await waitFor(() => {
        expect(isTagUnderGroup(tagName, Label.Manual)).toBe(true);
      });
    });
  });
});
