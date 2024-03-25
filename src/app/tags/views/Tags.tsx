import { useState } from "react";

import { useSelector } from "react-redux";
import { Route, Routes, useMatch } from "react-router-dom";

import TagsHeader from "../components/TagsHeader";
import TagForms from "../components/TagsHeader/TagForms";
import { TagSidePanelViews } from "../constants";

import TagDetails from "./TagDetails";
import TagList from "./TagList";
import TagMachines from "./TagMachines";

import PageContent from "@/app/base/components/PageContent";
import { useId } from "@/app/base/hooks/base";
import { useSidePanel } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import NotFound from "@/app/base/views/NotFound";
import type { RootState } from "@/app/store/root/types";
import tagSelectors, { TagSearchFilter } from "@/app/store/tag/selectors";
import type { Tag, TagMeta } from "@/app/store/tag/types";
import { getSidePanelTitle } from "@/app/store/utils/node/base";
import { getRelativeRoute } from "@/app/utils";

const Tags = (): JSX.Element => {
  const detailsMatch = useMatch(urls.tags.tag.index(null));
  const isDetails = !!detailsMatch;
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
  const onDelete = (id: Tag[TagMeta.PK], fromDetails?: boolean) =>
    setSidePanelContent({
      view: TagSidePanelViews.DeleteTag,
      extras: { fromDetails, id },
    });
  const onUpdate = (id: Tag[TagMeta.PK]) =>
    setSidePanelContent({
      view: TagSidePanelViews.UpdateTag,
      extras: {
        id,
      },
    });
  const base = urls.tags.tag.index(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(TagSearchFilter.All);
  const [searchText, setSearchText] = useState("");
  const tags = useSelector((state: RootState) =>
    tagSelectors.search(state, searchText, filter)
  );
  const tableId = useId();

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
      <Routes>
        <Route
          element={
            isDetails ? (
              <TagDetails />
            ) : (
              <TagList
                currentPage={currentPage}
                filter={filter}
                onDelete={onDelete}
                onUpdate={onUpdate}
                searchText={searchText}
                setCurrentPage={setCurrentPage}
                tableId={tableId}
                tags={tags}
              />
            )
          }
          path="/"
        />
        <Route
          element={<TagMachines />}
          path={getRelativeRoute(urls.tags.tag.machines(null), base)}
        />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </PageContent>
  );
};

export default Tags;
