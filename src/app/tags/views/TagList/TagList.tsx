import { Pagination } from "@canonical/maas-react-components";

import TagTable from "./TagTable";

import ListDisplayCount from "@/app/base/components/ListDisplayCount";
import { useWindowTitle } from "@/app/base/hooks";
import type { TagSearchFilter } from "@/app/store/tag/selectors";
import type { Tag, TagMeta } from "@/app/store/tag/types";

type Props = {
  readonly currentPage: number;
  readonly setCurrentPage: (page: number) => void;
  readonly filter: TagSearchFilter;
  readonly searchText: string;
  readonly tags: Tag[];
  readonly tableId: string;
  readonly onDelete: (id: Tag[TagMeta.PK], fromDetails?: boolean) => void;
  readonly onUpdate: (id: Tag[TagMeta.PK]) => void;
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
  onUpdate,
}: Props): React.ReactElement => {
  useWindowTitle("Tags");
  const pageSize = 50;

  return (
    <div aria-label={Label.Title}>
      <div className="u-flex--between u-flex--align-baseline u-flex--wrap">
        <hr />
        <ListDisplayCount
          count={tags.length}
          currentPage={currentPage}
          pageSize={pageSize}
          type="tag"
        />
        <span className="u-flex--end">
          <Pagination
            aria-label="pagination"
            currentPage={currentPage}
            disabled={tags.length === 0}
            onInputBlur={() => {}}
            onInputChange={(e) => {
              setCurrentPage(Number(e.target.value));
            }}
            onNextClick={() => {
              setCurrentPage(currentPage + 1);
            }}
            onPreviousClick={() => {
              setCurrentPage(currentPage - 1);
            }}
            totalPages={Math.ceil(tags.length / pageSize)}
          />
        </span>
      </div>
      <div className="u-nudge-down">
        <TagTable
          aria-label="tags"
          currentPage={currentPage}
          filter={filter}
          id={tableId}
          onDelete={onDelete}
          onUpdate={onUpdate}
          searchText={searchText}
          setCurrentPage={setCurrentPage}
          tags={tags}
        />
      </div>
    </div>
  );
};

export default TagList;
