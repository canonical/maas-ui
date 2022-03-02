import { Route, Switch } from "react-router-dom";

import TagDetails from "./TagDetails";

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
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Tags;
