import { useState } from "react";

import { Outlet, useMatch } from "react-router";

import { TagSidePanelViews } from "../../constants";
import TagForms from "../TagForms";
import TagsHeader from "../TagsListHeader";

import PageContent from "@/app/base/components/PageContent";
import { getSidePanelTitle, useSidePanel } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import { TagSearchFilter } from "@/app/store/tag/selectors";
import type { Tag, TagMeta } from "@/app/store/tag/types";

const TagsLayout = () => {
  const detailsMatch = useMatch(urls.tags.tag.index(null));
  const isDetails = !!detailsMatch;
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
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
  const [filter, setFilter] = useState(TagSearchFilter.All);
  const [searchText, setSearchText] = useState("");
  return (
    <PageContent
      header={
        <TagsHeader
          filter={filter}
          isDetails={isDetails}
          onDelete={onDelete}
          onUpdate={onUpdate}
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
      <Outlet />
    </PageContent>
  );
};

export default TagsLayout;
