import { useState } from "react";

import { useSelector } from "react-redux";
import {
  matchPath,
  Route,
  Routes,
  useLocation,
  useMatch,
} from "react-router-dom-v5-compat";

import TagsHeader from "../components/TagsHeader";
import TagForms from "../components/TagsHeader/TagForms";
import { TagSidePanelViews } from "../constants";
import { TagViewState } from "../types";

import TagDetails from "./TagDetails";
import TagList from "./TagList";
import TagMachines from "./TagMachines";

import PageContent from "app/base/components/PageContent";
import { useId } from "app/base/hooks/base";
import type { SidePanelContent } from "app/base/side-panel-context";
import { useSidePanel } from "app/base/side-panel-context";
import urls from "app/base/urls";
import NotFound from "app/base/views/NotFound";
import type { RootState } from "app/store/root/types";
import tagSelectors, { TagSearchFilter } from "app/store/tag/selectors";
import type { Tag, TagMeta } from "app/store/tag/types";
import { getSidePanelTitle } from "app/store/utils/node/base";
import { getRelativeRoute } from "app/utils";

const getViewState = (
  sidePanelContent: SidePanelContent | null,
  pathname: string
) => {
  if (sidePanelContent?.view === TagSidePanelViews.DeleteTag) {
    return TagViewState.Deleting;
  }
  if (sidePanelContent?.view === TagSidePanelViews.AddTag) {
    return TagViewState.Creating;
  }
  const isUpdating = matchPath(
    {
      path: urls.tags.tag.update(null),
      end: true,
    },
    pathname
  );
  if (isUpdating) {
    return TagViewState.Updating;
  }
  return null;
};

const Tags = (): JSX.Element => {
  const { pathname } = useLocation();
  const detailsMatch = useMatch(urls.tags.tag.index(null));
  const isDetails = !!detailsMatch;
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
  const tagViewState = getViewState(sidePanelContent, pathname);
  const onDelete = (id: Tag[TagMeta.PK], fromDetails?: boolean) =>
    setSidePanelContent({
      view: TagSidePanelViews.DeleteTag,
      extras: { fromDetails, id },
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
          searchText={searchText}
          setFilter={setFilter}
          setSearchText={setSearchText}
          setSidePanelContent={setSidePanelContent}
          tagViewState={tagViewState}
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
              <TagDetails tagViewState={tagViewState} />
            ) : (
              <TagList
                currentPage={currentPage}
                filter={filter}
                onDelete={onDelete}
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
          element={<TagDetails tagViewState={tagViewState} />}
          path={getRelativeRoute(urls.tags.tag.update(null), base)}
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
