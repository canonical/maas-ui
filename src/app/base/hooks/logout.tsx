import { useDispatch } from "react-redux";

import { resetSilentPolling } from "@/app/api/query/imageSync";
import { statusActions } from "@/app/store/status";
import { clearCookie } from "@/app/utils";

export const useLogout = () => {
  const dispatch = useDispatch();

  return () => {
    resetSilentPolling();
    localStorage.removeItem("maas-config");
    clearCookie("maas_v3_access_token", {
      path: "/",
    });
    dispatch(statusActions.logout());
  };
};
