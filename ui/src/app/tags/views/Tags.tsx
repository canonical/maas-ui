import { useState } from "react";

import { matchPath, Route, Switch, useLocation } from "react-router-dom";

import TagsHeader from "../components/TagsHeader";
import { TagHeaderViews } from "../constants";
import type { TagHeaderContent } from "../types";
import { TagViewState } from "../types";

import TagDetails from "./TagDetails";
import TagList from "./TagList";
import TagMachines from "./TagMachines";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import type { Tag, TagMeta } from "app/store/tag/types";
import tagsURLs from "app/tags/urls";

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
  const isUpdating = matchPath(pathname, {
    exact: true,
    path: tagsURLs.tag.update(null, true),
    strict: false,
  });
  if (isUpdating) {
    return TagViewState.Updating;
  }
  return null;
};

const Tags = (): JSX.Element => {
  const { pathname } = useLocation();
  const [headerContent, setHeaderContent] = useState<TagHeaderContent | null>(
    null
  );
  const tagViewState = getViewState(headerContent, pathname);
  const onDelete = (id: Tag[TagMeta.PK], fromDetails?: boolean) =>
    setHeaderContent({
      extras: { fromDetails, id },
      view: TagHeaderViews.DeleteTag,
    });
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
      <Switch>
        <Route
          exact
          path={tagsURLs.tag.index(null, true)}
          render={() => (
            <TagDetails onDelete={onDelete} tagViewState={tagViewState} />
          )}
        />
        <Route
          exact
          path={tagsURLs.tag.update(null, true)}
          render={() => (
            <TagDetails onDelete={onDelete} tagViewState={tagViewState} />
          )}
        />
        <Route
          exact
          path={tagsURLs.tag.machines(null, true)}
          render={() => <TagMachines />}
        />
        <Route
          exact
          path={tagsURLs.tags.index}
          render={() => <TagList onDelete={onDelete} />}
        />
        <Route path="*" render={() => <NotFound />} />
      </Switch>
    </Section>
  );
};

export default Tags;
