import { useState } from "react";

import { useSelector } from "react-redux";

import TagListControls from "./TagListControls";
import TagTable from "./TagTable";

import { useWindowTitle } from "app/base/hooks";
import type { RootState } from "app/store/root/types";
import tagSelectors, { TagSearchFilter } from "app/store/tag/selectors";

export enum TestId {
  TagListControls = "TagListControls",
  TagTable = "TagTable",
}

const TagList = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(TagSearchFilter.All);
  const [searchText, setSearchText] = useState("");
  const tags = useSelector((state: RootState) =>
    tagSelectors.search(state, searchText, filter)
  );

  useWindowTitle("Tags");

  return (
    <>
      <TagListControls
        data-testid="TagListControls"
        filter={filter}
        currentPage={currentPage}
        setFilter={setFilter}
        searchText={searchText}
        setCurrentPage={setCurrentPage}
        setSearchText={setSearchText}
        tagCount={tags.length}
      />
      <TagTable
        data-testid="TagTable"
        currentPage={currentPage}
        filter={filter}
        searchText={searchText}
        setCurrentPage={setCurrentPage}
        tags={tags}
      />
    </>
  );
};

export default TagList;
