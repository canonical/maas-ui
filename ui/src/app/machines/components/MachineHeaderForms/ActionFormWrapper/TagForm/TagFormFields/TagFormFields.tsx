import type { ReactNode } from "react";
import { useState } from "react";

import { Col, Icon, Modal, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import usePortal from "react-useportal";

import AddTagForm from "../AddTagForm";
import TagFormChanges from "../TagFormChanges";
import { useSelectedTags, useUnchangedTags } from "../hooks";
import type { TagFormValues } from "../types";

import TagField from "app/base/components/TagField";
import type { Tag as TagSelectorTag } from "app/base/components/TagSelector/TagSelector";
import { NULL_EVENT } from "app/base/constants";
import type { Machine } from "app/store/machine/types";
import { getTagCountsForMachines } from "app/store/machine/utils";
import tagSelectors from "app/store/tag/selectors";
import type { Tag } from "app/store/tag/types";

const hasKernelOptions = (tags: Tag[], tag: TagSelectorTag) =>
  !!tags.find(({ id }) => tag.id === id)?.kernel_opts;

type Props = {
  machines: Machine[];
  viewingDetails?: boolean;
  viewingMachineConfig?: boolean;
};

export enum Label {
  AddTag = "Create a new tag",
  TagInput = "Search existing or add new tags",
}

export const TagFormFields = ({
  machines,
  viewingDetails = false,
  viewingMachineConfig = false,
}: Props): JSX.Element => {
  const { openPortal, closePortal, isOpen, Portal } = usePortal();
  const [newTagName, setNewTagName] = useState<string | null>(null);
  const { setFieldValue, values } = useFormikContext<TagFormValues>();
  const selectedTags = useSelectedTags("added");
  const tags = useSelector(tagSelectors.getManual);
  const tagIdsAndCounts = getTagCountsForMachines(machines);
  // Tags can't be added if they already exist on all machines or already in
  // the added/removed lists.
  const unchangedTags = useUnchangedTags(tags);
  const availableTags = unchangedTags.filter(
    (tag) => tagIdsAndCounts.get(tag.id) !== machines.length
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
                  <span className="u-nudge-left--small">
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
          <TagFormChanges machines={machines} />
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
                closePortal(NULL_EVENT);
              }}
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
