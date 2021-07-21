import { Route, Switch } from "react-router-dom";

import ImagesIntro from "./ImagesIntro";
import MaasIntro from "./MaasIntro";
import MaasIntroSuccess from "./MaasIntroSuccess";
import UserIntro from "./UserIntro";

import NotFound from "app/base/views/NotFound";
import introURLs from "app/intro/urls";

const Intro = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={introURLs.index}>
        <MaasIntro />
      </Route>
      <Route exact path={introURLs.images}>
        <ImagesIntro />
      </Route>
      <Route exact path={introURLs.success}>
        <MaasIntroSuccess />
      </Route>
      <Route exact path={introURLs.user}>
        <UserIntro />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default Intro;
