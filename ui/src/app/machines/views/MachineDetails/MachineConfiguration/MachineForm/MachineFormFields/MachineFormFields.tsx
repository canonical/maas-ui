import * as React from "react";

import { Col, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { MachineFormValues } from "../MachineForm";

import ArchitectureSelect from "app/base/components/ArchitectureSelect";
import FormikField from "app/base/components/FormikField";
import MinimumKernelSelect from "app/base/components/MinimumKernelSelect";
import ResourcePoolSelect from "app/base/components/ResourcePoolSelect";
import TagSelector from "app/base/components/TagSelector";
import ZoneSelect from "app/base/components/ZoneSelect";
import TagLinks from "app/machines/components/TagLinks";
import tagSelectors from "app/store/tag/selectors";

type Props = { editing: boolean };

const MachineFormFields = ({ editing }: Props): JSX.Element => {
  const allTags = useSelector(tagSelectors.all);
  const {
    initialValues,
    setFieldValue,
  } = useFormikContext<MachineFormValues>();
  const allTagsSorted = [...allTags].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const sortedInitialTags = [...initialValues.tags].sort();

  return (
    <Row>
      <Col size="6">
        <ArchitectureSelect disabled={!editing} name="architecture" />
        <MinimumKernelSelect disabled={!editing} name="minHweKernel" />
        <ZoneSelect disabled={!editing} name="zone" />
        <ResourcePoolSelect disabled={!editing} name="pool" />
        <FormikField
          disabled={!editing}
          label="Note"
          name="description"
          type="text"
        />
        {editing ? (
          <FormikField
            allowNewTags
            component={TagSelector}
            initialSelected={sortedInitialTags.map((tag) => ({ name: tag }))}
            label="Tags"
            name="tags"
            onTagsUpdate={(selectedTags: { name: string }[]) => {
              setFieldValue(
                "tags",
                // Convert back to array of strings
                selectedTags.map((tag) => tag.name)
              );
            }}
            placeholder="Select or create tags"
            tags={allTagsSorted}
          />
        ) : (
          <>
            <p>Tags</p>
            <p>
              <TagLinks filterType="tags" tags={sortedInitialTags} />
            </p>
          </>
        )}
      </Col>
    </Row>
  );
};

export default MachineFormFields;
