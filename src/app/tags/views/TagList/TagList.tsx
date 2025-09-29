import { useId, useState } from "react";

import { Pagination } from "@canonical/maas-react-components";
import { useSelector } from "react-redux";

import TagForms from "../../components/TagForms";
import TagTable from "../../components/TagTable";
import TagsListHeader from "../../components/TagsListHeader";
import { TagSidePanelViews } from "../../constants";

import ListDisplayCount from "@/app/base/components/ListDisplayCount";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { getSidePanelTitle, useSidePanel } from "@/app/base/side-panel-context";
import type { RootState } from "@/app/store/root/types";
import tagSelectors, { TagSearchFilter } from "@/app/store/tag/selectors";
import type { Tag, TagMeta } from "@/app/store/tag/types";

export enum Label {
  Title = "Tag list",
}

const TagList = (): React.ReactElement => {
  useWindowTitle("Tags");
  const pageSize = 50;

  const { sidePanelContent, setSidePanelContent } = useSidePanel();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(TagSearchFilter.All);
  const [searchText, setSearchText] = useState("");
  const tags = useSelector((state: RootState) =>
    tagSelectors.search(state, searchText, filter)
  );

  const tableId = useId();
  const onDelete = (id: Tag[TagMeta.PK], fromDetails?: boolean) => {
    setSidePanelContent({
      view: TagSidePanelViews.DeleteTag,
      extras: { fromDetails, id },
    });
  };
  const onUpdate = (id: Tag[TagMeta.PK]) => {
    setSidePanelContent({
      view: TagSidePanelViews.UpdateTag,
      extras: {
        id,
      },
    });
  };

  return (
    <PageContent
      header={
        <TagsListHeader
          filter={filter}
          searchText={searchText}
          setFilter={setFilter}
          setSearchText={setSearchText}
          setSidePanelContent={setSidePanelContent}
        />
      }
      sidePanelContent={
        sidePanelContent && (
          <TagForms
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
          />
        )
      }
      sidePanelTitle={getSidePanelTitle("Tags", sidePanelContent)}
    >
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
    </PageContent>
  );
};

export default TagList;
