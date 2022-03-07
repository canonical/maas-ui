import { useState } from "react";

import { Route, Switch } from "react-router-dom";

import TagsHeader from "../components/TagsHeader";
import type { TagHeaderContent } from "../types";

import TagDetails from "./TagDetails";
import TagList from "./TagList";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import tagsURLs from "app/tags/urls";

const Tags = (): JSX.Element => {
  const [headerContent, setHeaderContent] = useState<TagHeaderContent | null>(
    null
  );
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
          render={() => <TagDetails />}
        />
        <Route exact path={tagsURLs.tags.index} render={() => <TagList />} />
        <Route path="*" render={() => <NotFound />} />
      </Switch>
    </Section>
  );
};

export default Tags;
