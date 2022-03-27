import { Col, Row } from "@canonical/react-components";
import { useSelector } from "react-redux";

import Definition from "app/base/components/Definition";
import FormikField from "app/base/components/FormikField";
import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import type { Tag, TagMeta } from "app/store/tag/types";
import AppliedTo from "app/tags/components/AppliedTo";
import DefinitionField from "app/tags/components/DefinitionField";
import KernelOptionsField from "app/tags/components/KernelOptionsField";
import { Label } from "app/tags/views/TagDetails";

type Props = {
  id: Tag[TagMeta.PK];
};

export const TagUpdateFormFields = ({ id }: Props): JSX.Element | null => {
  const tag = useSelector((state: RootState) =>
    tagSelectors.getById(state, id)
  );

  if (!tag) {
    return null;
  }

  return (
    <>
      <Row>
        <Col size={12}>
          <h4 className="u-sv1">Update {tag.name}</h4>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col size={2}>
          <FormikField
            label={Label.Name}
            name="name"
            placeholder="Enter a name for the tag."
            type="text"
            required
          />
        </Col>
        <Col size={2}>
          <Definition description={tag.updated} label={Label.Update} />
        </Col>
        <Col size={2}>
          <Definition label={Label.AppliedTo}>
            <AppliedTo id={id} />
          </Definition>
        </Col>
        <Col size={6}>
          <FormikField
            label={Label.Comment}
            name="comment"
            placeholder="Add a comment as an explanation for this tag."
            type="text"
          />
        </Col>
      </Row>
      <hr className="u-sv1" />
      <Row>
        <Col size={6}>
          <KernelOptionsField id={id} />
        </Col>
        <Col size={6}>
          {/* // TODO: Add the link to the docs:
          // https://github.com/canonical-web-and-design/app-tribe/issues/748 */}
          {!tag.definition ? (
            <Definition label={Label.Definition}>
              <span className="p-form-help-text">
                This is a manual tag. Definitions cannot be added to manual
                tags. To learn more about this, check our{" "}
                <a href="#todo">XPath documentation</a>.
              </span>
            </Definition>
          ) : (
            <DefinitionField id={id} />
          )}
        </Col>
      </Row>
    </>
  );
};

export default TagUpdateFormFields;
