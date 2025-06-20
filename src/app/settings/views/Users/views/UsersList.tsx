import React, { useEffect } from "react";

import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { getSidePanelTitle, useSidePanel } from "@/app/base/side-panel-context";
import {
  AddUser,
  DeleteUser,
  EditUser,
  UsersTable,
} from "@/app/settings/views/Users/components";
import { UserActionSidePanelViews } from "@/app/settings/views/Users/constants";
import statusSelectors from "@/app/store/status/selectors";
import { isId } from "@/app/utils";

const UsersList = (): React.ReactElement => {
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);

  useWindowTitle("Users");

  const closeForm = () => {
    setSidePanelContent(null);
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
