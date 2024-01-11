import TagTable from "./TagTable";

import ArrowPagination from "app/base/components/ArrowPagination";
import { useWindowTitle } from "app/base/hooks";
import type { TagSearchFilter } from "app/store/tag/selectors";
import type { Tag, TagMeta } from "app/store/tag/types";

type Props = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filter: TagSearchFilter;
  searchText: string;
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
  searchText,
  tags,
  tableId,
  onDelete,
}: Props): JSX.Element => {
  useWindowTitle("Tags");

  return (
    <div aria-label={Label.Title}>
      <ArrowPagination
        className="u-display--inline-block"
        currentPage={currentPage}
        itemCount={tags.length}
        pageSize={50}
        setCurrentPage={setCurrentPage}
        showPageBounds
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
