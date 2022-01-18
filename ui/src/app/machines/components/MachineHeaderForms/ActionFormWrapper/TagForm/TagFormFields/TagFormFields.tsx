import { Col, Row } from "@canonical/react-components";
import { useSelector } from "react-redux";

import TagNameField from "app/base/components/TagNameField";
import tagSelectors from "app/store/tag/selectors";

export const TagFormFields = (): JSX.Element => {
  const tags = useSelector(tagSelectors.all);
  return (
    <Row>
      <Col size={6}>
        <TagNameField required tagList={tags.map(({ name }) => name)} />
      </Col>
    </Row>
  );
};

export default TagFormFields;
