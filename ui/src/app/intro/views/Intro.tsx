import type { ReactNode } from "react";

import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import { useExitURL } from "../hooks";

import ImagesIntro from "./ImagesIntro";
import IncompleteCard from "./IncompleteCard";
import MaasIntro from "./MaasIntro";
import MaasIntroSuccess from "./MaasIntroSuccess";
import UserIntro from "./UserIntro";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import introURLs from "app/intro/urls";
import authSelectors from "app/store/auth/selectors";
import configSelectors from "app/store/config/selectors";
import { getCookie } from "app/utils";

const Intro = (): JSX.Element => {
  const location = useLocation();
  const authLoading = useSelector(authSelectors.loading);
  const isAdmin = useSelector(authSelectors.isAdmin);
  const configLoading = useSelector(configSelectors.loading);
  const authUser = useSelector(authSelectors.get);
  const completedIntro = useSelector(configSelectors.completedIntro);
  const exitURL = useExitURL();
  const setupIntroComplete = completedIntro || !!getCookie("skipsetupintro");
  const userIntroComplete =
    authUser?.completed_intro || !!getCookie("skipintro");
  const viewingUserIntro = location.pathname.startsWith(introURLs.user);

  let content: ReactNode;
  if (authLoading || configLoading) {
    content = <Spinner text="Loading..." />;
  } else if (!setupIntroComplete && !isAdmin) {
    // Prevent the user from reaching any of the intro urls if they are not an
    // admin.
    content = <IncompleteCard />;
  } else if (setupIntroComplete && userIntroComplete) {
    // If both intros have been completed then exit the flow.
    return <Redirect to={exitURL} />;
  } else if (viewingUserIntro && !setupIntroComplete) {
    // If the user is viewing the user intro but hasn't yet completed the maas
    // intro then send them back to the start.
    return <Redirect to={introURLs.index} />;
  } else if (!viewingUserIntro && setupIntroComplete) {
    // If the user is viewing the maas intro but has already completed it then
    // send them to the user intro.
    return <Redirect to={introURLs.user} />;
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
