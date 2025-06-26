import { useDispatch } from "react-redux";

import { statusActions } from "@/app/store/status";

export const useLogout = () => {
  const dispatch = useDispatch();

  return () => {
    localStorage.removeItem("maas-config");
    dispatch(statusActions.logout());
  };
};
