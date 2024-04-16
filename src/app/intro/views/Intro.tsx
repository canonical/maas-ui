import type { ReactNode } from "react";
import { useEffect } from "react";

import { useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { useExitURL } from "../hooks";

import ImagesIntro from "./ImagesIntro";
import IncompleteCard from "./IncompleteCard";
import MaasIntro from "./MaasIntro";
import MaasIntroSuccess from "./MaasIntroSuccess";
import UserIntro from "./UserIntro";

import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useCompletedIntro, useCompletedUserIntro } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import authSelectors from "@/app/store/auth/selectors";
import configSelectors from "@/app/store/config/selectors";
import { getRelativeRoute } from "@/app/utils";

const Intro = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const authLoading = useSelector(authSelectors.loading);
  const isAdmin = useSelector(authSelectors.isAdmin);
  const configLoading = useSelector(configSelectors.loading);
  const completedIntro = useCompletedIntro();
  const completedUserIntro = useCompletedUserIntro();
  const exitURL = useExitURL();
  const viewingUserIntro = location.pathname.startsWith(urls.intro.user);
  const showIncomplete = !completedIntro && !isAdmin;

  useEffect(() => {
    if (!authLoading && !configLoading && !showIncomplete) {
      if (completedIntro && completedUserIntro) {
        // If both intros have been completed then exit the flow.
        navigate(exitURL, { replace: true });
      } else if (viewingUserIntro && !completedIntro) {
        // If the user is viewing the user intro but hasn't yet completed the maas
        // intro then send them back to the start.
        navigate(urls.intro.index, { replace: true });
      } else if (!viewingUserIntro && completedIntro) {
        // If the user is viewing the maas intro but has already completed it then
        // send them to the user intro.
        navigate(urls.intro.user, { replace: true });
      }
    }
  }, [
    navigate,
    authLoading,
    configLoading,
    completedIntro,
    isAdmin,
    completedUserIntro,
    showIncomplete,
    viewingUserIntro,
    exitURL,
  ]);

  let content: ReactNode;
  if (authLoading || configLoading) {
    content = (
      <PageContent
        header={<SectionHeader loading />}
        sidePanelContent={null}
        sidePanelTitle={null}
      />
    );
  } else if (showIncomplete) {
    // Prevent the user from reaching any of the intro urls if they are not an admin
    content = <IncompleteCard />;
  }
  if (content) {
    return <>{content}</>;
  }
  const base = `${urls.intro.index}`;
  return (
    <Routes>
      <Route element={<MaasIntro />} path="/" />
      <Route
        element={<ImagesIntro />}
        path={getRelativeRoute(urls.intro.images, base)}
      />
      <Route
        element={<MaasIntroSuccess />}
        path={getRelativeRoute(urls.intro.success, base)}
      />
      <Route
        element={<UserIntro />}
        path={getRelativeRoute(urls.intro.user, base)}
      />
    </Routes>
  );
};

export default Intro;
