import { Link } from "react-router-dom";

import type { Tag } from "@/app/store/tag/types";

type Props<T extends string | Tag> = {
  getLinkURL: (tag: T) => string;
  tags: T[];
};

const getTagName = <T extends string | Tag>(tag: T) =>
  typeof tag === "string" ? tag : tag.name;

const TagLinks = <T extends string | Tag>({
  getLinkURL,
  tags,
}: Props<T>): JSX.Element => {
  const sortedTags = [...tags].sort((a, b) =>
    getTagName(a).localeCompare(getTagName(b))
  );
  return (
    <span className="u-break-word">
      {sortedTags.map((tag, i) => {
        const tagName = getTagName(tag);
        const url = getLinkURL(tag);
        return (
          <span key={tagName}>
            <Link to={url}>{tagName}</Link>
            {i !== tags.length - 1 && ", "}
          </span>
        );
      })}
    </span>
  );
};

export default TagLinks;
