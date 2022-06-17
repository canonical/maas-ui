import { useState } from "react";

import { useSelector } from "react-redux";

import TagListControls from "./TagListControls";
import TagTable from "./TagTable";

import { useWindowTitle } from "app/base/hooks";
import { useId } from "app/base/hooks/base";
import type { RootState } from "app/store/root/types";
import tagSelectors, { TagSearchFilter } from "app/store/tag/selectors";
import type { Tag, TagMeta } from "app/store/tag/types";

type Props = {
  onDelete: (id: Tag[TagMeta.PK], fromDetails?: boolean) => void;
};

export enum Label {
  Title = "Tag list",
}

const TagList = ({ onDelete }: Props): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(TagSearchFilter.All);
  const [searchText, setSearchText] = useState("");
  const tags = useSelector((state: RootState) =>
    tagSelectors.search(state, searchText, filter)
  );
  const tableId = useId();

  useWindowTitle("Tags");

  return (
    <div aria-label={Label.Title}>
      <TagListControls
        aria-controls={tableId}
        aria-label="tag list controls"
        currentPage={currentPage}
        filter={filter}
        searchText={searchText}
        setCurrentPage={setCurrentPage}
        setFilter={setFilter}
        setSearchText={setSearchText}
        tagCount={tags.length}
      />
      <TagTable
        aria-label="tags"
        currentPage={currentPage}
        filter={filter}
        id={tableId}
        onDelete={onDelete}
        searchText={searchText}
        setCurrentPage={setCurrentPage}
        tags={tags}
      />
    </div>
  );
};

export default TagList;
