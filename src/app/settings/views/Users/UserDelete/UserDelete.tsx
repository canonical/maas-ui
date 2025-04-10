import type { ReactElement } from "react";

import { useSelector } from "react-redux";

import { useGetURLId } from "@/app/base/hooks";
import UserDeleteForm from "@/app/settings/views/Users/UserDeleteForm";
import type { RootState } from "@/app/store/root/types";
import userSelectors from "@/app/store/user/selectors";
import { UserMeta } from "@/app/store/user/types";

const UserDelete = (): ReactElement => {
  const id = useGetURLId(UserMeta.PK);
  const user = useSelector((state: RootState) =>
    userSelectors.getById(state, id)
  );

  if (!user) {
    return <h4>User not found</h4>;
  }

  return <UserDeleteForm user={user} />;
};

export default UserDelete;
