import { useSelector } from "react-redux";

import urls from "app/base/urls";
import authSelectors from "app/store/auth/selectors";

/**
 * Get the URL to redirect to when the intro closes.
 * @returns The URL to redirect to.
 */
export const useExitURL = (): string => {
  const authUser = useSelector(authSelectors.get);
  return authUser?.is_superuser ? urls.dashboard.index : urls.machines.index;
};
