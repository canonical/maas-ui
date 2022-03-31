import type { ReactNode } from "react";

import { Col, Icon, Row } from "@canonical/react-components";
import { useSelector } from "react-redux";

import TagFormChanges from "../TagFormChanges";
import { useSelectedTags } from "../hooks";

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

export const TagFormFields = ({ machines }: Props): JSX.Element => {
  const addedTags = useSelectedTags();
  const tags = useSelector(tagSelectors.getManual);
  return (
    <Row>
      <Col size={6} className="col-start-large-4">
        <TagField
          externalSelectedTags={addedTags}
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
            <div className="u-flex--between p-text--x-small-capitalised">
              <span>Tag name</span>
              <span>Kernel options</span>
            </div>
          }
          label="Search existing or add new tags"
          name="tags"
          placeholder=""
          showSelectedTags={false}
          storedValue="id"
          tags={tags.map(({ id, name }) => ({ id, name }))}
          useExternalTags
        />
        <TagFormChanges machines={machines} />
      </Col>
    </Row>
  );
};

export default TagFormFields;
