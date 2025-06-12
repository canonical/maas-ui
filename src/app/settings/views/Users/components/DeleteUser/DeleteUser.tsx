import type { ReactElement } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";

import { useDeleteUser, useGetUser } from "@/app/api/query/users";
import { getUserQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import ModelActionForm from "@/app/base/components/ModelActionForm";

type DeleteUserProps = {
  id: number;
  closeForm: () => void;
};

const DeleteUser = ({ id, closeForm }: DeleteUserProps): ReactElement => {
  const queryClient = useQueryClient();
  const user = useGetUser({ path: { user_id: id } });
  const deleteUser = useDeleteUser();

  return (
    <>
      {user.isPending && <Spinner text="Loading..." />}
      {user.isError && (
        <Notification data-testid="no-such-pool-error" severity="negative">
          AZ with id {id} does not exist.
        </Notification>
      )}
      {user.isSuccess && user.data && (
        <ModelActionForm
          aria-label="Confirm user deletion"
          errors={deleteUser.error}
          initialValues={{}}
          message={
            <>
              {`Are you sure you want to delete \`${user.data.username}\`?`}
              <br />
              <span className="u-text--light">
                This action is permanent and can not be undone.
              </span>
            </>
          }
          modelType="user"
          onCancel={closeForm}
          onSubmit={() => {
            deleteUser.mutate({ path: { user_id: id } });
          }}
          onSuccess={async () => {
            // async with closeForm called first, because unlike
            // other delete forms, this one uses GET
            closeForm();
            void queryClient.invalidateQueries({
              queryKey: getUserQueryKey({
                path: { user_id: id },
              }),
            });
          }}
          saved={deleteUser.isSuccess}
          saving={deleteUser.isPending}
        />
      )}
    </>
  );
};

export default DeleteUser;
