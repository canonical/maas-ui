import { useState } from "react";

import { Route, Switch } from "react-router-dom";

import TagsHeader from "../components/TagsHeader";
import { TagHeaderViews } from "../constants";
import type { TagHeaderContent } from "../types";

import TagDetails from "./TagDetails";
import TagList from "./TagList";
import TagMachines from "./TagMachines";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import type { Tag, TagMeta } from "app/store/tag/types";
import tagsURLs from "app/tags/urls";

const Tags = (): JSX.Element => {
  const [headerContent, setHeaderContent] = useState<TagHeaderContent | null>(
    null
  );
  const onDelete = (id: Tag[TagMeta.PK], fromDetails?: boolean) =>
    setHeaderContent({
      view: TagHeaderViews.DeleteTag,
      extras: { fromDetails, id },
    });
  return (
    <Section
      header={
        <TagsHeader
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
        />
      }
    >
      <Switch>
        <Route
          exact
          path={tagsURLs.tag.index(null, true)}
          render={() => <TagDetails onDelete={onDelete} />}
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
