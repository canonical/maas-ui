import { useState } from "react";

import {
  matchPath,
  Route,
  Routes,
  useLocation,
  useMatch,
} from "react-router-dom-v5-compat";

import TagsHeader from "../components/TagsHeader";
import { TagHeaderViews } from "../constants";
import type { TagHeaderContent } from "../types";
import { TagViewState } from "../types";

import TagDetails from "./TagDetails";
import TagList from "./TagList";
import TagMachines from "./TagMachines";

import Section from "app/base/components/Section";
import urls from "app/base/urls";
import NotFound from "app/base/views/NotFound";
import type { Tag, TagMeta } from "app/store/tag/types";
import { getRelativeRoute } from "app/utils";

const getViewState = (
  headerContent: TagHeaderContent | null,
  pathname: string
) => {
  if (headerContent?.view === TagHeaderViews.DeleteTag) {
    return TagViewState.Deleting;
  }
  if (headerContent?.view === TagHeaderViews.AddTag) {
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
  const [headerContent, setHeaderContent] = useState<TagHeaderContent | null>(
    null
  );
  const tagViewState = getViewState(headerContent, pathname);
  const onDelete = (id: Tag[TagMeta.PK], fromDetails?: boolean) =>
    setHeaderContent({
      view: TagHeaderViews.DeleteTag,
      extras: { fromDetails, id },
    });
  const base = urls.tags.tag.index(null);
  return (
    <Section
      header={
        <TagsHeader
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
          tagViewState={tagViewState}
        />
      }
    >
      <Routes>
        <Route
          element={
            isDetails ? (
              <TagDetails onDelete={onDelete} tagViewState={tagViewState} />
            ) : (
              <TagList onDelete={onDelete} />
            )
          }
          path="/"
        />
        <Route
          element={
            <TagDetails onDelete={onDelete} tagViewState={tagViewState} />
          }
          path={getRelativeRoute(urls.tags.tag.update(null), base)}
        />
        <Route
          element={<TagMachines />}
          path={getRelativeRoute(urls.tags.tag.machines(null), base)}
        />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </Section>
  );
};

export default Tags;
