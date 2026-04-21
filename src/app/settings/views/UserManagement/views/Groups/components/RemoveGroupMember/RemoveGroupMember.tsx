import type { Dispatch, SetStateAction } from "react";

import pluralize from "pluralize";

import { useRemoveGroupMembers } from "@/app/api/query/groups";
import type {
  UserGroupMemberResponse,
  UserGroupResponse,
} from "@/app/apiclient";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context";

type RemoveGroupMemberProps = {
  group_id: UserGroupResponse["id"];
  members: UserGroupMemberResponse[];
  setMemberSelection: Dispatch<SetStateAction<UserGroupMemberResponse[]>>;
};

const RemoveGroupMember = ({
  group_id,
  members,
  setMemberSelection,
}: RemoveGroupMemberProps) => {
  const { closeSidePanel } = useSidePanel();
  const removeMembers = useRemoveGroupMembers();

  return (
    <ModelActionForm
      aria-label="Remove group member"
      errors={removeMembers.error}
      initialValues={{}}
      message={
        <>
          <p>
            Are you sure you want to remove the following{" "}
            {pluralize("member", members.length)} from the group?
          </p>
          <ul>
            {members.map(({ username, email }) => (
              <li key={username}>
                {username} ({email})
              </li>
            ))}
          </ul>
        </>
      }
      modelType="group member"
      onCancel={closeSidePanel}
      onSubmit={() => {
        removeMembers.mutate({
          path: {
            group_id,
          },
          query: {
            id: members.map((member) => member.user_id),
          },
        });
      }}
      onSuccess={() => {
        setMemberSelection([]);
        closeSidePanel();
      }}
      saved={removeMembers.isSuccess}
      saving={removeMembers.isPending}
      submitAppearance="negative"
      submitLabel={`Remove ${members.length} ${pluralize("member", members.length)}`}
    />
  );
};

export default RemoveGroupMember;
