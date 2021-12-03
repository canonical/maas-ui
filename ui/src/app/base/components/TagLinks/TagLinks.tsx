import { Link } from "react-router-dom";

type Props = {
  getLinkURL: (tag: string) => string;
  tags: string[];
};

const TagLinks = ({ getLinkURL, tags }: Props): JSX.Element => {
  const sortedTags = [...tags].sort();
  return (
    <span className="u-break-word">
      {sortedTags.map((tag, i) => {
        const url = getLinkURL(tag);
        return (
          <span key={tag}>
            <Link to={url}>{tag}</Link>
            {i !== tags.length - 1 && ", "}
          </span>
        );
      })}
    </span>
  );
};

export default TagLinks;
