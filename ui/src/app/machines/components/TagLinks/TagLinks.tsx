import { Link } from "react-router-dom";

import { filtersToQueryString } from "app/machines/search";
import machineURLs from "app/machines/urls";

type Props = {
  // Machines can be filtered by the tags on the machines themselves, or tags on
  // any of its storage devices (disks, partitions, etc).
  filterType: "storage_tags" | "tags";
  tags: string[];
};

const TagLinks = ({ filterType, tags }: Props): JSX.Element => {
  return (
    <>
      {tags.map((tag, i) => {
        const filter = filtersToQueryString({ [filterType]: [`=${tag}`] });
        return (
          <span key={tag}>
            <Link to={`${machineURLs.machines.index}${filter}`}>{tag}</Link>
            {i !== tags.length - 1 && ", "}
          </span>
        );
      })}
    </>
  );
};

export default TagLinks;
