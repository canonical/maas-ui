import type { ReactNode } from "react";

import { Icon } from "@canonical/react-components";
import { useSelector } from "react-redux";

import TagField from "app/base/components/TagField";
import type { Tag as TagSelectorTag } from "app/base/components/TagSelector/TagSelector";
import tagSelectors from "app/store/tag/selectors";
import type { Tag } from "app/store/tag/types";

const hasKernelOptions = (tags: Tag[], tag: TagSelectorTag) =>
  !!tags.find(({ id }) => tag.id === id)?.kernel_opts;

export const TagFormFields = (): JSX.Element => {
  const tags = useSelector(tagSelectors.getManual);

  return (
    <div className="tag-form">
      <div className="tag-form__search">
        <TagField
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
          label="Search existing / add new tags:"
          name="tags"
          placeholder=""
          showSelectedTags={false}
          storedValue="id"
          tags={tags.map(({ id, name }) => ({ id, name }))}
        />
      </div>
      <div className="tag-form__changes">
        <p className="u-text--muted">
          Tags for selected machines will appear here.
        </p>
      </div>
      <div className="tag-form__details">
        <p className="u-text--muted">
          Select a tag to view information about it.
        </p>
      </div>
    </div>
  );
};

export default TagFormFields;
