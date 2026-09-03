import { Outlet } from "react-router";

import { useFetchActions } from "@/app/base/hooks";
import { configActions } from "@/app/store/config";

const Settings = (): React.ReactElement => {
  useFetchActions([configActions.fetch]);

  return <Outlet />;
};

export default Settings;
