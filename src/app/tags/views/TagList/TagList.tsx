import TagListControls from "./TagListControls";
import TagTable from "./TagTable";

import { useWindowTitle } from "app/base/hooks";
import type { TagSearchFilter } from "app/store/tag/selectors";
import type { Tag, TagMeta } from "app/store/tag/types";

type Props = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filter: TagSearchFilter;
  setFilter: (filter: TagSearchFilter) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
  tags: Tag[];
  tableId: string;
  onDelete: (id: Tag[TagMeta.PK], fromDetails?: boolean) => void;
};

export enum Label {
  Title = "Tag list",
}

const TagList = ({
  currentPage,
  setCurrentPage,
  filter,
  setFilter,
  searchText,
  setSearchText,
  tags,
  tableId,
  onDelete,
}: Props): JSX.Element => {
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
