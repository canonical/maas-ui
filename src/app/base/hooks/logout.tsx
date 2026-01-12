import { useDispatch } from "react-redux";

import { resetSilentPolling } from "@/app/api/query/images";
import { statusActions } from "@/app/store/status";

export const useLogout = () => {
  const dispatch = useDispatch();

  return () => {
    resetSilentPolling();
    localStorage.removeItem("maas-config");
    dispatch(statusActions.logout());
  };
};
