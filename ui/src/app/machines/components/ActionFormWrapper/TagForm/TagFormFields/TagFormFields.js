import { Col, Row } from "@canonical/react-components";
import React from "react";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import tagSelectors from "app/store/tag/selectors";
import FormikField from "app/base/components/FormikField";
import TagSelector from "app/base/components/TagSelector";

export const TagFormFields = () => {
  const { initialValues, setFieldValue } = useFormikContext();
  const tags = useSelector(tagSelectors.all);
  const sortedTags = tags
    .map((tag) => ({ displayName: tag.name, name: tag.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Row>
      <Col size="6">
        <FormikField
          allowNewTags
          component={TagSelector}
          initialSelected={initialValues.tags}
          label="Tags"
          name="tags"
          onTagsUpdate={(selectedTags) => setFieldValue("tags", selectedTags)}
          placeholder="Select or create tags"
          required
          tags={sortedTags}
        />
      </Col>
    </Row>
  );
};

export default TagFormFields;
