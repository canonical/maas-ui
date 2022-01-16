import { Route, Switch } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import imagesURLs from "app/images/urls";
import ImageList from "app/images/views/ImageList";

const Images = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={imagesURLs.index} component={() => <ImageList />} />
      <Route path="*" component={() => <NotFound />} />
    </Switch>
  );
};

export default Images;
