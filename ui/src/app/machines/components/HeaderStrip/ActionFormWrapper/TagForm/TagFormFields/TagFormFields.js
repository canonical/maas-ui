import { Col, Row } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import { tag as tagActions } from "app/base/actions";
import { tag as tagSelectors } from "app/base/selectors";
import FormikField from "app/base/components/FormikField";
import TagSelector from "app/base/components/TagSelector";

export const TagFormFields = () => {
  const dispatch = useDispatch();
  const { setFieldValue } = useFormikContext();
  const tags = useSelector(tagSelectors.all);
  const sortedTags = tags
    .map((tag) => tag.name)
    .sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  return (
    <Row>
      <Col size="6">
        <FormikField
          component={TagSelector}
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
