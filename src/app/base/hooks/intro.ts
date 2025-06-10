import { useSelector } from "react-redux";

import { useGetThisUser } from "@/app/api/query/users";
import configSelectors from "@/app/store/config/selectors";
import { getCookie } from "@/app/utils";

/**
 * Returns whether the initial setup intro has been completed or skipped.
 */
export const useCompletedIntro = (): boolean => {
  const completedIntro = useSelector(configSelectors.completedIntro);
  return !!completedIntro || !!getCookie("skipsetupintro");
};

/**
 * Returns whether the user intro has been completed or skipped.
 */
export const useCompletedUserIntro = (): boolean => {
  const user = useGetThisUser();
  return user.data?.completed_intro || !!getCookie("skipintro");
};
