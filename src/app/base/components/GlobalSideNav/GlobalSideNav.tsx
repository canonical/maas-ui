import type { ReactNode } from "react";
import { useEffect, useContext } from "react";

import type { NavLink } from "@canonical/react-components";
import { Icon, isNavigationButton, Theme } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useNavigate,
  useLocation,
  matchPath,
  useMatch,
} from "react-router-dom-v5-compat";

import {
  useCompletedIntro,
  useCompletedUserIntro,
  useGoogleAnalytics,
} from "app/base/hooks";
import ThemePreviewContext from "app/base/theme-preview-context";
import urls from "app/base/urls";
import authSelectors from "app/store/auth/selectors";
import configSelectors from "app/store/config/selectors";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import type { RootState } from "app/store/root/types";
import { actions as statusActions } from "app/store/status";

const GlobalSideNav = (): JSX.Element => {
  return (
    <>
      <p>hello</p>
    </>
  );
};

export default GlobalSideNav;
