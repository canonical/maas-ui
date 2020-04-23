import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { general as generalActions } from "app/base/actions";
import { general as generalSelectors } from "app/base/selectors";

const DeprecationList = () => {
  const dispatch = useDispatch();
  const deprecationNotices = useSelector(
    generalSelectors.deprecationNotices.filterByMinorVersion
  );

  useEffect(() => {
    dispatch(generalActions.fetchVersion());
    dispatch(generalActions.fetchDeprecationNotices());
  }, [dispatch]);

  return (
    <>
      {deprecationNotices.map((notice) => (
        <Notification
          data-test={`deprecation-${notice.id}`}
          key={notice.id}
          type="caution"
        >
          {notice.description}
          <br />
          {notice.url && (
            <a className="p-link--external" href={notice.url}>
              {notice["link-text"]
                ? `${notice["link-text"]}...`
                : "Learn more..."}
            </a>
          )}
        </Notification>
      ))}
    </>
  );
};

export default DeprecationList;
