import React, { useEffect } from "react";

import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { useUserCount } from "@/app/api/query/users";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { getSidePanelTitle, useSidePanel } from "@/app/base/side-panel-context";
import AddUser from "@/app/settings/views/Users/components/AddUser/AddUser";
import DeleteUser from "@/app/settings/views/Users/components/DeleteUser/DeleteUser";
import EditUser from "@/app/settings/views/Users/components/EditUser/EditUser";
import UsersTable from "@/app/settings/views/Users/components/UsersTable/UsersTable";
import { UserActionSidePanelViews } from "@/app/settings/views/Users/constants";
import statusSelectors from "@/app/store/status/selectors";
import { isId } from "@/app/utils";

const UsersList = (): React.ReactElement => {
  const usersCount = useUserCount();
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);

  useWindowTitle("Users");

  const closeForm = () => {
    setSidePanelContent(null);
    // useWebsocketAwareQuery filtering the invalidations prevents
    // the hooks from causing a list update, this line forces it
    void usersCount.refetch();
  };

  useEffect(() => {
    setSidePanelContent(null);
  }, [setSidePanelContent]);

  let content = null;

  if (
    sidePanelContent &&
    sidePanelContent.view === UserActionSidePanelViews.CREATE_USER
  ) {
    content = <AddUser closeForm={closeForm} key="add-user-form" />;
  } else if (
    sidePanelContent &&
    sidePanelContent.view === UserActionSidePanelViews.EDIT_USER
  ) {
    const userId =
      sidePanelContent.extras && "userId" in sidePanelContent.extras
        ? sidePanelContent.extras.userId
        : null;
    content = isId(userId) ? (
      <EditUser closeForm={closeForm} id={userId} />
    ) : null;
  } else if (
    sidePanelContent &&
    sidePanelContent.view === UserActionSidePanelViews.DELETE_USER
  ) {
    const userId =
      sidePanelContent.extras && "userId" in sidePanelContent.extras
        ? sidePanelContent.extras.userId
        : null;
    content = isId(userId) ? (
      <DeleteUser closeForm={closeForm} id={userId} />
    ) : null;
  }

  if (externalAuthURL) {
    return (
      <Notification severity="information">
        Users for this MAAS are managed using an external service
      </Notification>
    );
  }

  return (
    <PageContent
      sidePanelContent={content}
      sidePanelTitle={getSidePanelTitle("Users", sidePanelContent)}
    >
      <UsersTable />
    </PageContent>
  );
};

export default UsersList;
