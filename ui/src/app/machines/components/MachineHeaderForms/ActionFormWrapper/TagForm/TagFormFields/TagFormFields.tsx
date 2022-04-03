import type { ReactNode } from "react";
import { useState } from "react";

import { Col, Icon, Modal, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import usePortal from "react-useportal";

import AddTagForm from "../AddTagForm";
import TagFormChanges from "../TagFormChanges";
import { useSelectedTags } from "../hooks";
import type { TagFormValues } from "../types";

import TagField from "app/base/components/TagField";
import type { Tag as TagSelectorTag } from "app/base/components/TagSelector/TagSelector";
import type { Machine } from "app/store/machine/types";
import tagSelectors from "app/store/tag/selectors";
import type { Tag } from "app/store/tag/types";

const hasKernelOptions = (tags: Tag[], tag: TagSelectorTag) =>
  !!tags.find(({ id }) => tag.id === id)?.kernel_opts;

type Props = {
  machines: Machine[];
};

export enum Label {
  AddTag = "Create a new tag",
  TagInput = "Search existing or add new tags",
}

// usePortal was originally design to work with click events, so to open the
// portal programmatically we need to fake the event. This workaround can be
// removed when this issue is resolved:
// https://github.com/alex-cory/react-useportal/issues/36
const NULL_EVENT = { currentTarget: { contains: () => false } };

export const TagFormFields = ({ machines }: Props): JSX.Element => {
  const { openPortal, closePortal, isOpen, Portal } = usePortal();
  const [newTagName, setNewTagName] = useState<string | null>(null);
  const { setFieldValue, values } = useFormikContext<TagFormValues>();
  const selectedTags = useSelectedTags();
  const tags = useSelector(tagSelectors.getManual);
  return (
    <>
      <Row>
        <Col size={6} className="col-start-large-4">
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
            name="tags"
            onAddNewTag={(name) => {
              setNewTagName(name);
              openPortal(NULL_EVENT);
            }}
            placeholder=""
            showSelectedTags={false}
            storedValue="id"
            tags={tags.map(({ id, name }) => ({ id, name }))}
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
                setFieldValue("tags", values.tags.concat([tag.id.toString()]));
                setNewTagName(null);
                closePortal(NULL_EVENT);
              }}
            />
          </Modal>
        </Portal>
      ) : null}
    </>
  );
};

export default TagFormFields;
