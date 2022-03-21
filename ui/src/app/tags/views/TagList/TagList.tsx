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
  onDelete: (id: Tag[TagMeta.PK]) => void;
};

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
    <>
      <TagListControls
        aria-label="tag list controls"
        aria-controls={tableId}
        filter={filter}
        currentPage={currentPage}
        setFilter={setFilter}
        searchText={searchText}
        setCurrentPage={setCurrentPage}
        setSearchText={setSearchText}
        tagCount={tags.length}
      />
      <TagTable
        aria-label="tags"
        onDelete={onDelete}
        currentPage={currentPage}
        filter={filter}
        id={tableId}
        searchText={searchText}
        setCurrentPage={setCurrentPage}
        tags={tags}
      />
    </>
  );
};

export default TagList;
