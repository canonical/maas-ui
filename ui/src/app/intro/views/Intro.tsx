import type { ReactNode } from "react";

import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import ImagesIntro from "./ImagesIntro";
import IncompleteCard from "./IncompleteCard";
import MaasIntro from "./MaasIntro";
import MaasIntroSuccess from "./MaasIntroSuccess";
import UserIntro from "./UserIntro";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import introURLs from "app/intro/urls";
import authSelectors from "app/store/auth/selectors";

const Intro = (): JSX.Element => {
  const loading = useSelector(authSelectors.loading);
  const authUser = useSelector(authSelectors.get);
  let content: ReactNode;
  if (loading) {
    content = <Spinner text="Loading..." />;
  } else if (authUser && !authUser.is_superuser) {
    // Prevent the user from reaching any of the intro urls if they are not an
    // admin.
    content = <IncompleteCard />;
  }
  if (content) {
    return <Section>{content}</Section>;
  }

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
