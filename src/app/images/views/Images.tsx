import { Route, Switch } from "react-router-dom";

import urls from "app/base/urls";
import NotFound from "app/base/views/NotFound";
import ImageList from "app/images/views/ImageList";

const Images = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={urls.images.index} render={() => <ImageList />} />
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Images;
