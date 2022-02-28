import { Route, Switch } from "react-router-dom";

import TagDetails from "./TagDetails";
import TagList from "./TagList";

import NotFound from "app/base/views/NotFound";
import tagsURLs from "app/tags/urls";

const Tags = (): JSX.Element => {
  return (
    <Switch>
      <Route
        exact
        path={tagsURLs.tag.index(null, true)}
        render={() => <TagDetails />}
      />
      <Route exact path={tagsURLs.tags.index} render={() => <TagList />} />
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Tags;
