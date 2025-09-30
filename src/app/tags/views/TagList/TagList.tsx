import { useId, useState } from "react";

import { useSelector } from "react-redux";

import TagForms from "../../components/TagForms";
import TagTable from "../../components/TagTable";
import TagsListHeader from "../../components/TagsListHeader";
import { TagSidePanelViews } from "../../constants";

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

  const { sidePanelContent, setSidePanelContent } = useSidePanel();
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
        <div className="u-nudge-down">
          <TagTable
            filter={filter}
            id={tableId}
            onDelete={onDelete}
            onUpdate={onUpdate}
            searchText={searchText}
            tags={tags}
          />
        </div>
      </div>
    </PageContent>
  );
};

export default TagList;
