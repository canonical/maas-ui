import { useSelector } from "react-redux";

import TagNameField from "app/base/components/TagNameField";
import tagSelectors from "app/store/tag/selectors";

export const TagFormFields = (): JSX.Element => {
  const tags = useSelector(tagSelectors.all);
  return (
    <div className="tag-form">
      <div className="tag-form__search">
        <TagNameField required tagList={tags.map(({ name }) => name)} />
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
