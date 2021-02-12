import { Col, Row } from "@canonical/react-components";
import { useSelector } from "react-redux";

import tagSelectors from "app/store/tag/selectors";
import TagField from "app/base/components/TagField";

export const TagFormFields = () => {
  const tags = useSelector(tagSelectors.all);
  return (
    <Row>
      <Col size="6">
        <TagField required tagList={tags.map(({ name }) => name)} />
      </Col>
    </Row>
  );
};

export default TagFormFields;
