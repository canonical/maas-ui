import { useSelector } from "react-redux";

import dashboardURLs from "app/dashboard/urls";
import machineURLs from "app/machines/urls";
import authSelectors from "app/store/auth/selectors";

/**
 * Combines formik validation errors and errors returned from server
 * for use in formik forms.
 * @param errors - The errors object in redux state.
 */
export const useExitURL = (): string => {
  const authUser = useSelector(authSelectors.get);
  return authUser?.is_superuser
    ? dashboardURLs.index
    : machineURLs.machines.index;
};
