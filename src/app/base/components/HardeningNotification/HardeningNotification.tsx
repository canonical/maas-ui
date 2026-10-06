import type { ReactElement } from "react";

import { Notification } from "@canonical/react-components";
import { Link } from "react-router";

import {
  isHardeningNotification,
  useActiveNotifications,
} from "@/app/api/query/notifications";
import urls from "@/app/base/urls";

const HardeningNotification = (): ReactElement => {
  const { data, isError, error } = useActiveNotifications();
  const count = data?.items.filter(isHardeningNotification).length ?? 0;

  return (
    <>
      {isError && (
        <Notification
          role="alert"
          severity="negative"
          title="Error while fetching hardening notifications"
        >
          {error.message}
        </Notification>
      )}
      {count > 0 && (
        <Notification role="alert" severity="negative">
          Hardening has been enabled, but {count} condition
          {count === 1 ? "" : "s"} {count === 1 ? "has" : "have"} not been met.{" "}
          <Link to={urls.settings.security.hardeningStatus}>
            Go to hardening settings...
          </Link>
        </Notification>
      )}
    </>
  );
};

export default HardeningNotification;
