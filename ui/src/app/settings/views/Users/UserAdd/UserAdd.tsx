import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";

import UserForm from "../UserForm";

import statusSelectors from "app/store/status/selectors";

export const UserAdd = (): JSX.Element => {
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);

  if (externalAuthURL) {
    return (
      <Notification severity="information">
        Users for this MAAS are managed using an external service
      </Notification>
    );
  }
  return <UserForm />;
};

export default UserAdd;
