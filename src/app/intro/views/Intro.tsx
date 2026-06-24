import type { ReactElement, ReactNode } from "react";
import { useEffect } from "react";

import { useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router";

import { useExitURL } from "../hooks";

import ImagesIntro from "./ImagesIntro";
import IncompleteCard from "./IncompleteCard";
import MaasIntro from "./MaasIntro";
import MaasIntroSuccess from "./MaasIntroSuccess";
import UserIntro from "./UserIntro";

import { useGetCurrentUser } from "@/app/api/query/auth";
import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import {
  useCompletedIntro,
  useCompletedUserIntro,
  useHasEntitlements,
} from "@/app/base/hooks";
import type { SyncNavigateFunction } from "@/app/base/types";
import urls from "@/app/base/urls";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import configSelectors from "@/app/store/config/selectors";
import { getRelativeRoute } from "@/app/utils";

const Intro = (): ReactElement => {
  const navigate: SyncNavigateFunction = useNavigate();
  const location = useLocation();
  const configLoading = useSelector(configSelectors.loading);
  const completedIntro = useCompletedIntro();
  const completedUserIntro = useCompletedUserIntro();
  const exitURL = useExitURL();
  const viewingUserIntro = location.pathname.startsWith(urls.intro.user);

  const user = useGetCurrentUser();
  // We don't have a way to check if the user is a superuser, so we
  // check if they have all the EDIT entitlements.
  const isSuperUser = useHasEntitlements([
    Entitlement.CAN_EDIT_CONFIGURATIONS,
    Entitlement.CAN_EDIT_GLOBAL_ENTITIES,
    Entitlement.CAN_EDIT_IDENTITIES,
    Entitlement.CAN_EDIT_MACHINES,
    Entitlement.CAN_EDIT_BOOT_ENTITIES,
    Entitlement.CAN_EDIT_LICENSE_KEYS,
    Entitlement.CAN_EDIT_CONTROLLERS,
    Entitlement.CAN_EDIT_NOTIFICATIONS,
  ]);

  const showIncomplete = !completedIntro && !completedUserIntro && !isSuperUser;

  useEffect(() => {
    if (!user.isPending && !configLoading && !showIncomplete) {
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
    user.data,
    user.isPending,
    configLoading,
    completedIntro,
    completedUserIntro,
    showIncomplete,
    viewingUserIntro,
    exitURL,
  ]);

  let content: ReactNode;
  if (user.isPending || configLoading) {
    content = <PageContent header={<SectionHeader loading />} />;
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
