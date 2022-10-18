import type { ReactNode } from "react";
import { useState } from "react";

import { Col, Icon, Modal, Row, Spinner } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import usePortal from "react-useportal";

import AddTagForm from "../AddTagForm";
import TagFormChanges from "../TagFormChanges";
import {
  useFetchTagsForSelected,
  useSelectedTags,
  useUnchangedTags,
} from "../hooks";
import type { TagFormValues } from "../types";

import TagField from "app/base/components/TagField";
import type { Tag as TagSelectorTag } from "app/base/components/TagSelector/TagSelector";
import { NULL_EVENT } from "app/base/constants";
import type { MachineActionFormProps } from "app/machines/types";
import type { Machine, SelectedMachines } from "app/store/machine/types";
import tagSelectors from "app/store/tag/selectors";
import type { Tag, TagMeta } from "app/store/tag/types";
import { getTagCounts } from "app/store/tag/utils";

const hasKernelOptions = (tags: Tag[], tag: TagSelectorTag) =>
  !!tags.find(({ id }) => tag.id === id)?.kernel_opts;

type Props = {
  machines: Machine[];
  newTags: Tag[TagMeta.PK][];
  setNewTags: (tags: Tag[TagMeta.PK][]) => void;
  viewingDetails?: boolean;
  viewingMachineConfig?: boolean;
  selectedMachines?: SelectedMachines | null;
  selectedCount?: number | null;
} & Pick<MachineActionFormProps, "searchFilter">;

export enum Label {
  AddTag = "Create a new tag",
  TagInput = "Search existing or add new tags",
}

export const TagFormFields = ({
  machines,
  newTags,
  setNewTags,
  searchFilter,
  selectedMachines,
  selectedCount,
  viewingDetails = false,
  viewingMachineConfig = false,
}: Props): JSX.Element => {
  const { openPortal, closePortal, isOpen, Portal } = usePortal();
  const [newTagName, setNewTagName] = useState<string | null>(null);
  const { setFieldValue, values } = useFormikContext<TagFormValues>();
  const selectedTags = useSelectedTags("added");
  const { tags, loading: tagsLoading } = useFetchTagsForSelected({
    selectedMachines,
    searchFilter,
  });
  const allManualTags = useSelector(tagSelectors.getManual);
  const tagIdsAndCounts = getTagCounts(tags);
  // Tags can't be added if they already exist on all machines or already in
  // the added/removed lists.
  const unchangedTags = useUnchangedTags(allManualTags);
  const availableTags = unchangedTags.filter(
    (tag) => tagIdsAndCounts?.get(tag.id) !== selectedCount
  );
  return (
    <>
      <Row>
        <Col emptyLarge={viewingMachineConfig ? undefined : 4} size={6}>
          <TagField
            externalSelectedTags={selectedTags}
            generateDropdownEntry={(
              tag: TagSelectorTag,
              highlightedName: ReactNode
            ) => (
              <div className="u-flex--between">
                <span>{highlightedName}</span>
                {hasKernelOptions(tags, tag) ? (
                  <span
                    aria-label="with kernel options"
                    className="u-nudge-left--small"
                  >
                    <Icon name="tick" />
                  </span>
                ) : null}
              </div>
            )}
            header={
              <div className="u-flex--between p-text--x-small-capitalised u-nudge-down--x-small">
                <span>Tag name</span>
                <span>Kernel options</span>
              </div>
            }
            label={Label.TagInput}
            name="added"
            onAddNewTag={(name) => {
              setNewTagName(name);
              openPortal(NULL_EVENT);
            }}
            placeholder=""
            showSelectedTags={false}
            storedValue="id"
            tags={availableTags.map(({ id, name }) => ({ id, name }))}
          />
          {tags.length === 0 && tagsLoading ? (
            <Spinner text="Loading tags..." />
          ) : (
            <TagFormChanges
              newTags={newTags}
              selectedCount={selectedCount}
              tags={tags}
            />
          )}
        </Col>
      </Row>
      {isOpen ? (
        <Portal>
          <Modal
            className="tag-form__modal"
            close={() => closePortal(NULL_EVENT)}
            title={Label.AddTag}
          >
            <AddTagForm
              machines={machines}
              name={newTagName}
              onTagCreated={(tag) => {
                setFieldValue(
                  "added",
                  values.added.concat([tag.id.toString()])
                );
                setNewTagName(null);
                setNewTags([...newTags, tag.id]);
                closePortal(NULL_EVENT);
              }}
              searchFilter={searchFilter}
              selectedMachines={selectedMachines}
              viewingDetails={viewingDetails}
              viewingMachineConfig={viewingMachineConfig}
            />
          </Modal>
        </Portal>
      ) : null}
    </>
  );
};

export default TagFormFields;
