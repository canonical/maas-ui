import { useState } from "react";

import { Col, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import FormikForm from "@/app/base/components/FormikForm";
import { useAddMessage } from "@/app/base/hooks";
import type { EmptyObject } from "@/app/base/types";
import settingsURLs from "@/app/settings/urls";
import { userActions } from "@/app/store/user";
import userSelectors from "@/app/store/user/selectors";
import type { User } from "@/app/store/user/types";

type UserDeleteProps = {
  user: User;
};

const UserDeleteForm = ({ user }: UserDeleteProps) => {
  const [deletedUser, setDeletedUser] = useState<User["username"] | null>(null);
  const navigate = useNavigate();
  const saved = useSelector(userSelectors.saved);
  const saving = useSelector(userSelectors.saving);
  const errors = useSelector(userSelectors.errors);
  const dispatch = useDispatch();

  useAddMessage(
    saved && !errors,
    userActions.cleanup,
    `${deletedUser} removed successfully`
  );

  return (
    <FormikForm<EmptyObject>
      aria-label="Delete user"
      initialValues={{}}
      onCancel={() => navigate({ pathname: settingsURLs.users.index })}
      onSubmit={() => {
        dispatch(userActions.delete(user.id));
        setDeletedUser(user.username);
      }}
      saved={saved}
      savedRedirect={settingsURLs.users.index}
      saving={saving}
      submitAppearance="negative"
      submitLabel="Delete"
    >
      <Row>
        <Col size={12}>
          <p className="u-nudge-down--small">
            {`Are you sure you want to delete \`${user.username}\`?`}
          </p>
          <span className="u-text--light">
            This action is permanent and can not be undone.
          </span>
        </Col>
      </Row>
    </FormikForm>
  );
};

export default UserDeleteForm;
