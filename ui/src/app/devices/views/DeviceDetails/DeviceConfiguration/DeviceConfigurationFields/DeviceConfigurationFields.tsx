import { useState } from "react";

import { Col, Modal, Row, Textarea } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import usePortal from "react-useportal";

import type { DeviceConfigurationValues } from "../types";

import FormikField from "app/base/components/FormikField";
import TagIdField from "app/base/components/TagIdField";
import ZoneSelect from "app/base/components/ZoneSelect";
import { NULL_EVENT } from "app/base/constants";
import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import AddTagForm from "app/tags/components/AddTagForm";

export enum Label {
  AddTag = "Create a new tag",
  Note = "Note",
}

const DeviceConfigurationFields = (): JSX.Element => {
  const { setFieldValue, values } =
    useFormikContext<DeviceConfigurationValues>();
  const selectedTags = useSelector((state: RootState) =>
    tagSelectors.getByIDs(state, values.tags)
  );
  const { openPortal, closePortal, isOpen, Portal } = usePortal();
  const [newTagName, setNewTagName] = useState<string | null>(null);
  const allTags = useSelector(tagSelectors.all);

  return (
    <>
      <Row>
        <Col size={6}>
          <ZoneSelect name="zone" />
          <FormikField
            component={Textarea}
            label={Label.Note}
            name="description"
          />
          <TagIdField
            externalSelectedTags={selectedTags}
            name="tags"
            placeholder="Create or remove tags"
            tagList={allTags}
            onAddNewTag={(name) => {
              setNewTagName(name);
              openPortal(NULL_EVENT);
            }}
          />
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
              name={newTagName}
              onSaveAnalytics={{
                action: "Manual tag created",
                category: "Device configuration create tag form",
                label: "Save",
              }}
              onTagCreated={(tag) => {
                setFieldValue("tags", values.tags.concat([tag.id]));
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

export default DeviceConfigurationFields;
