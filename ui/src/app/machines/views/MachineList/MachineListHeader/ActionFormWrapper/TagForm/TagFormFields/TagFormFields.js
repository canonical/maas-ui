import { Col, Row } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import { tag as tagActions } from "app/base/actions";
import tagSelectors from "app/store/tag/selectors";
import FormikField from "app/base/components/FormikField";
import TagSelector from "app/base/components/TagSelector";

export const TagFormFields = () => {
  const dispatch = useDispatch();
  const { initialValues, setFieldValue } = useFormikContext();
  const tags = useSelector(tagSelectors.all);
  const sortedTags = tags
    .map((tag) => ({ displayName: tag.name, name: tag.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

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
